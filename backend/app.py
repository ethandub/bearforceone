from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from twilio.rest import Client
import firebase_admin
from firebase_admin import credentials, firestore
from dateutil.parser import parse

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Firebase
cred = credentials.Certificate('firebase-credentials.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Initialize Twilio and SendGrid clients
twilio_client = Client(os.getenv('TWILIO_ACCOUNT_SID'), os.getenv('TWILIO_AUTH_TOKEN'))
sendgrid_client = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))

def time_overlap(time1, time2, threshold_minutes=30):
    """Check if two times are within threshold_minutes of each other"""
    time1 = parse(time1) if isinstance(time1, str) else time1
    time2 = parse(time2) if isinstance(time2, str) else time2
    return abs((time1 - time2).total_seconds()) <= threshold_minutes * 60

def is_compatible(user, group):
    """Check if a user is compatible with all members of a group"""
    for member in group:
        if not time_overlap(user['arrival_time'], member['arrival_time']):
            return False
        if user['location'] != member['location']:
            return False
    return True

def send_notifications(group_members):
    """Send notifications to all members of a group"""
    member_details = []
    for member in group_members:
        member_details.append(f"{member['name']} (arriving at {member['arrival_time']})")
    
    message = "New travel match found! You've been matched with:\n" + "\n".join(member_details)
    
    for member in group_members:
        # Send SMS via Twilio
        try:
            twilio_client.messages.create(
                body=message,
                from_=os.getenv('TWILIO_PHONE_NUMBER'),
                to=member['phone']
            )
        except Exception as e:
            print(f"Error sending SMS to {member['phone']}: {str(e)}")

        # Send email via SendGrid
        try:
            email = Mail(
                from_email=os.getenv('SENDGRID_FROM_EMAIL'),
                to_emails=member['email'],
                subject='New Travel Match Found!',
                html_content=message.replace('\n', '<br>')
            )
            sendgrid_client.send(email)
        except Exception as e:
            print(f"Error sending email to {member['email']}: {str(e)}")

@app.route('/api/submit-details', methods=['POST'])
def submit_details():
    """Handle form submission and matching logic"""
    try:
        user_data = request.json
        
        # Store user data in Firestore
        users_ref = db.collection('users')
        user_doc = users_ref.document()
        user_data['id'] = user_doc.id
        user_doc.set(user_data)

        # Find matching groups
        groups_ref = db.collection('groups')
        groups = groups_ref.get()
        
        matched_group = None
        for group in groups:
            group_data = group.to_dict()
            group_members = [users_ref.document(uid).get().to_dict() 
                           for uid in group_data['members']]
            
            if is_compatible(user_data, group_members):
                matched_group = group
                break

        if matched_group:
            # Add user to existing group
            group_data = matched_group.to_dict()
            group_data['members'].append(user_data['id'])
            matched_group.reference.update(group_data)
            
            # Get updated group members for notification
            group_members = [users_ref.document(uid).get().to_dict() 
                           for uid in group_data['members']]
            send_notifications(group_members)
        else:
            # Create new group
            new_group = {
                'members': [user_data['id']],
                'arrival_time': user_data['arrival_time'],
                'location': user_data['location']
            }
            groups_ref.add(new_group)

        return jsonify({'status': 'success', 'message': 'User details submitted successfully'})

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/groups/<user_id>', methods=['GET'])
def get_user_groups(user_id):
    """Get groups for a specific user"""
    try:
        groups = db.collection('groups').where('members', 'array_contains', user_id).get()
        
        result = []
        for group in groups:
            group_data = group.to_dict()
            members = []
            for member_id in group_data['members']:
                member = db.collection('users').document(member_id).get().to_dict()
                if member:
                    members.append(member)
            
            group_data['members'] = members
            result.append(group_data)
            
        return jsonify({'status': 'success', 'groups': result})

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
