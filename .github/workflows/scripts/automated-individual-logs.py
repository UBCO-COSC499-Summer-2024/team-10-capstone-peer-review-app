from github import Github, Project
from datetime import datetime, timedelta
from pytz import timezone
import os
import requests

g = Github(os.getenv('GITHUB_TOKEN'))

api_key = os.getenv('CLOCKIFY_API_KEY')

repo = g.get_repo("UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app")

tz = timezone('America/Vancouver')

base_url = 'https://api.clockify.me/api/v1'

headers = {
    'X-Api-Key': api_key
}

workspace_id = '664d8e0fe973a23fc5fda5a0'

# List of usernames and their associated names
users = {
    # 'mahir': {'username': 'mahirr476', 'clockify_id': '664d8e0fe973a23fc5fda59f'},
    'josh': {'username': 'JoshFarwig', 'clockify_id': '664d1549831d3f5360a7fe2b'}, 
    # 'bhavya': {'username': 'Bhavya290223', 'clockify_id': '664e1af8e973a23fc5173dd1'},
    # 'abdul': {'username': 'namekeptanonymous', 'clockify_id': '664e1b16e8ad8876980027d2'}, 
}

# Get the current date and time
now = datetime.now(tz)
# if now.weekday() == 1:  # If today is Tuesday
#     start_date = now - timedelta(days=4)  # Last Thursday
#     end_date = now
# elif now.weekday() == 3:  # If today is Thursday
start_date = now - timedelta(days=2)  # Last Tuesday
end_date = now 
# else: # throw error if today is not Tuesday or Thursday  
#     raise ValueError('This script should only be run on Tuesdays or Thursdays') 

# Read the count from the file
try:
    with open('count.txt', 'r') as f:
        count = int(f.read())
except FileNotFoundError:
    count = 0

# Increment the count
count += 1

# Write the count back to the file
with open('count.txt', 'w') as f:
    f.write(str(count))


for name, user_info in users.items():

    github_username = user_info['username'] 
    clockify_id = user_info['clockify_id']

    # Get all issues assigned to the user in the date range
    issues = repo.get_issues(assignee=github_username, since=start_date, state='all')
    
    # Get all open issues assigned to the user
    open_issues = repo.get_issues(assignee=github_username, state='open')

    # Get all closed issues assigned to the user in the date range
    closed_issues = repo.get_issues(assignee=github_username, state='closed', since=start_date)

    # Get all pull requests
    pulls = repo.get_pulls(state='all')

    # Filter the pull requests by the user and the date range
    user_pulls = [pull for pull in pulls if pull.user.login == github_username and start_date <= pull.created_at <= end_date]

    # Api call to get the time entries for the user
    response = requests.get(f'{base_url}/workspaces/{workspace_id}/user/{clockify_id}/time-entries', headers=headers)

    # If the request was successful, parse the data
    if response.status_code == 200:
        time_entries = response.json()
        # Group the time entries by description
        grouped_time_entries = {}

        for time_entry in time_entries:
            description = time_entry['description']

            start_time = datetime.strptime(time_entry['timeInterval']['start'], '%Y-%m-%dT%H:%M:%SZ')
            start_time = start_time.replace(tzinfo=timezone('UTC')).astimezone(tz)

            if time_entry['timeInterval']['end']:
                end_time = datetime.strptime(time_entry['timeInterval']['end'], '%Y-%m-%dT%H:%M:%SZ')
                end_time = end_time.replace(tzinfo=timezone('UTC')).astimezone(tz)
                duration = (end_time - start_time).total_seconds() / 3600  # Convert duration to hours
            else:
                end_time = "Ongoing"; 
                duration = 0  # If the time entry is still ongoing, we consider its duration as 0 for the total duration calculation

            # If the start time is within the date range, add the time entry to the dictionary
            if start_date <= start_time <= end_date:
                if description not in grouped_time_entries:
                    grouped_time_entries[description] = [{'start_time': start_time, 'end_time': end_time, 'duration': duration}]
                else:
                    grouped_time_entries[description].append({'start_time': start_time, 'end_time': end_time, 'duration': duration})

        # Calculate the total duration for each description
        total_durations = {description: round(sum(time_entry['duration'] for time_entry in time_entries), 1) for description, time_entries in grouped_time_entries.items()}
      
    # Write the data to a file
    filename = f'weekly_logs/individual_logs/{name}_log.md'
    with open(filename, 'a') as f:
        f.write(f'\n# {name}\'s Log for Cycle {count}\n\n')
        f.write(f'\n## {start_date.strftime("%A, %B %d, %Y, %I:%M %p")} - {end_date.strftime("%A, %B %d, %Y, %I:%M %p")}\n\n')
        f.write('\n## Tasks worked on this cycle:\n')

        for issue in issues:
            if issue.pull_request is None:
                f.write(f'&nbsp; &nbsp; :orange_circle: **Issue-[{issue.number}]({issue.html_url})**: {issue.title}  \n  \n')

                if issue.labels: 
                    labels = [label.name for label in issue.labels]
                    f.write(f'&nbsp; &nbsp; &nbsp; &nbsp; :label: **Labels**: {", ".join(labels)} \n  \n')
    
        f.write('\n## Time entries from Clockify on this cycle:\n') 
        for description, time_entries in grouped_time_entries.items():
            f.write(f'&nbsp; &nbsp; :watch: **{description}** *(Total duration: {total_durations[description]} hours)*  \n  \n')
            for time_entry in time_entries:
                start_time = time_entry['start_time'].strftime('%A, %B %d, %Y, %I:%M %p')
                if time_entry['end_time'] != 'Ongoing':
                    end_time = time_entry['end_time'].strftime('%A, %B %d, %Y, %I:%M %p')
                    duration = str(round(time_entry['duration'], 1)) + " hours"
                else:
                    end_time = 'Ongoing'
                    duration = 'Ongoing'
                f.write(f'&nbsp; &nbsp; &nbsp; &nbsp; :clock10: {start_time} - {end_time} *({duration})*  \n  \n')

        f.write('\n## Features worked on this cycle:\n')
        for pull in user_pulls:
            f.write(f'&nbsp; &nbsp; :white_check_mark: **PR-[{pull.number}]({pull.html_url})**: {pull.title}  \n  \n')
        
        f.write('\n## Completed tasks:\n')
        for issue in closed_issues:
            if issue.pull_request is None:
                f.write(f'&nbsp; &nbsp; :purple_circle: **Issue-[{issue.number}]({issue.html_url})**: {issue.title}  \n  \n')

        f.write('\n## In-progress tasks:\n')
        for issue in open_issues:
            if issue.pull_request is None:
                f.write(f'&nbsp; &nbsp; :green_circle: **Issue-[{issue.number}]({issue.html_url})**: {issue.title}  \n  \n')
        
        f.write('\n## Recap on goals from last cycle\n')
        f.write('* \n')
        f.write('* \n')
        f.write('* \n')

        f.write('\n## Goals for next cycle\n')
        f.write('* \n')
        f.write('* \n')
        f.write('* \n')

