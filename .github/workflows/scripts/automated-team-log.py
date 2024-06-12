from github import Github
from datetime import datetime, timedelta
from pytz import timezone
import os
import requests
import matplotlib.pyplot as plt
import pandas as pd

# PAT for the automated-log-workflow
g = Github(os.getenv('AUTOMATED_LOG_TOKEN'))
# Api key for clockify
clockify_api_key = os.getenv('CLOCKIFY_API_KEY')
# Repo for the workflow
repo = g.get_repo("UBCO-COSC499-Summer-2024/team-10-capstone-peer-review-app")
# Timezone for the log creation
tz = timezone('America/Vancouver')
# ID of the workspace in Clockify
workspace_id = '664d8e0fe973a23fc5fda5a0'

# List of usernames and their associated names
users = {
    'Mahir': {'username': 'mahirr476', 'clockify_id': '664d8e0fe973a23fc5fda59f'},
    'Josh': {'username': 'JoshFarwig', 'clockify_id': '664d1549831d3f5360a7fe2b'}, 
    'Bhavya': {'username': 'Bhavya290223', 'clockify_id': '664e1af8e973a23fc5173dd1'},
    'Abdul': {'username': 'namekeptanonymous', 'clockify_id': '664e1b16e8ad8876980027d2'}, 
}

# Get the current date and time
now = datetime.now(tz)
if now.weekday() == 1:  # If today is Tuesday
    start_date = now - timedelta(days=4)  # Last Thursday
    end_date = now
elif now.weekday() == 3:  # If today is Thursday 
    start_date = now - timedelta(days=2)  # Last Tuesday
    end_date = now 
else: # throw error if today is not Tuesday or Thursday  
    raise ValueError('This script should only be run on Tuesdays or Thursdays') 

first_issue_start_date = datetime(year=2024, month=5, day=25)

end_date_no_tz = end_date.replace(tzinfo=None) 

# Read the cycle count from count-for-cycle.txt
try:
    with open('.github/workflows/scripts/count-for-cycle.txt', 'r') as f:
        count = int(f.read())
except FileNotFoundError:
    raise ValueError('FILE R/W ERR') 

def fetch_issues(state, since):
    issues = repo.get_issues(state=state, since=since)
    return [issue.raw_data for issue in issues]

def fetch_issues_since_start(state):
    issues = repo.get_issues(state=state)
    return [issue.raw_data for issue in issues]

def fetch_prs(state, since):
    prs = repo.get_pulls(state=state, sort='created', direction='desc')
    return [pr.raw_data for pr in prs if pr.created_at >= since] 

def fetch_clockify_time_entries():
    all_time_entries = {}
    for name, user_info in users.items():
        user_id = user_info['clockify_id']
        url = f"https://api.clockify.me/api/v1/workspaces/{workspace_id}/user/{user_id}/time-entries"
        headers = {'X-Api-Key': clockify_api_key}
        time_entries = requests.get(url, headers=headers).json()

        grouped_time_entries = {}
        for time_entry in time_entries:
            description = time_entry['description']
            # Convert the start and end times to the UTM-7, make it timezone aware
            start_time = datetime.strptime(time_entry['timeInterval']['start'], '%Y-%m-%dT%H:%M:%SZ')
            start_time = start_time.replace(tzinfo=timezone('UTC')).astimezone(tz)
            # If the time entry is still ongoing, we consider its duration as 0 for the total duration calculation
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

        # Calculate the total duration for each description and add it to the dictionary
        for description, time_entries in grouped_time_entries.items():
            total_duration = round(sum(time_entry['duration'] for time_entry in time_entries), 1)
            grouped_time_entries[description].append({'total_duration': total_duration})

        all_time_entries[name] = grouped_time_entries

    return all_time_entries

def generate_burnup_chart():
    issues = fetch_issues_since_start('all')
    closed_issues = [issue for issue in issues if issue['state'] == 'closed']

    dates = pd.date_range(start=first_issue_start_date, end=end_date_no_tz)
    opened_issues = []
    completed_issues = []
    
    for date in dates:
        opened = sum(1 for issue in issues if issue['state'] == 'open')
        completed = sum(1 for issue in closed_issues if issue.closed_at <= date)
        opened_issues.append(opened)
        completed_issues.append(completed)
    
    plt.plot(dates, opened_issues, label='Opened Issues')
    plt.plot(dates, completed_issues, label='Completed Issues')
    plt.xlabel('Date')
    plt.ylabel('Number of Issues')
    plt.legend()
    plt.title('Burnup Chart')

    plt.savefig(f'weekly_logs/burnup_charts/burnup_chart_cycle_{count}.png')

# Fetch everytime required
issues_all = fetch_issues('all', start_date)
issues_open = fetch_issues('open', first_issue_start_date)
issues_closed = fetch_issues('closed', start_date)
# For now, dont add PR's since they are already in invdividual logs
# prs_all = fetch_prs('all', start_date)
# prs_closed = fetch_prs('closed', start_date)
clockify_entries = fetch_clockify_time_entries()
generate_burnup_chart()

# Write the logs to a single file
filename = 'weekly_logs/team_log.md'

# Read existing content from the file
with open(filename, 'r') as f:
    old_content = f.read()

with open(filename, 'w') as f:
      # Write the log template to top of the file
    f.write(f'\n# Team 10\'s Log for Cycle {count}\n\n')
    f.write(f'\n## {start_date.strftime("%A, %B %d, %Y, %I:%M %p")} - {end_date.strftime("%A, %B %d, %Y, %I:%M %p")}\n\n')
    
    # Write all issues worked on
    f.write('\n## All tasks (issues) worked on this cycle:\n')
    for issue in issues_all:
        if issue.pull_request is None:
            f.write(f'&nbsp; &nbsp; :large_blue_circle: **Issue-[{issue.number}]({issue.html_url})**: {issue.title}  \n  \n') 

            if issue.assignees:
                assignees = [assignee.login for assignee in issue.assignees]
                f.write(f'&nbsp; &nbsp; &nbsp; &nbsp; :computer: **Assignees**: {{", ".join(assignees)}}  \n  \n')  

            if issue.labels:
                labels = [label.name for label in issue.labels]
                f.write(f'&nbsp; &nbsp; &nbsp; &nbsp; :label: **Labels**: {", ".join(labels)} \n  \n')
    
    # Write all time entries from Clockify
    f.write('\n## All time entries from Clockify on this cycle:\n')
    for name, grouped_time_entries in clockify_entries.items():
        f.write(f'### :bust_in_silhouette: **{name}\'s** time entries  \n  \n')  # Print the name
        for description, time_entries in grouped_time_entries.items():
            total_duration = time_entries[-1]['total_duration']
            f.write(f'&nbsp; &nbsp; :watch: **{description}** *(Total duration: {total_duration} hours)*  \n  \n')
            for time_entry in time_entries[:-1]:  # Exclude the last entry which is total_duration
                start_time = time_entry['start_time'].strftime('%A, %B %d, %Y, %I:%M %p')
                if time_entry['end_time'] != 'Ongoing':
                    end_time = time_entry['end_time'].strftime('%A, %B %d, %Y, %I:%M %p')
                    duration = str(round(time_entry['duration'], 1)) + " hours"
                else:
                    end_time = 'Ongoing'
                    duration = 'Ongoing'
                f.write(f'&nbsp; &nbsp; &nbsp; &nbsp; :clock10: {start_time} - {end_time} *({duration})*  \n  \n')

    f.write('\n## Completed tasks (closed issues) on this cycle:\n')
    for issue in issues_closed:
        if issue.pull_request is None:
            f.write(f'&nbsp; &nbsp; :purple_circle: **Issue-[{issue.number}]({issue.html_url})**: {issue.title}  \n  \n') 

            if issue.assignees:
                assignees = [assignee.login for assignee in issue.assignees]
                f.write(f'&nbsp; &nbsp; &nbsp; &nbsp; :computer: **Assignees**: {", ".join(assignees)}  \n  \n')  

    f.write('\n## Task (issues in-progress) assignments for next cycle \n') 
    for issue in issues_open:
        if issue.pull_request is None:
            f.write(f'&nbsp; &nbsp; :orange_circle: **Issue-[{issue.number}]({issue.html_url})**: {issue.title}  \n  \n') 

            if issue.assignees:
                assignees = [assignee.login for assignee in issue.assignees]
                f.write(f'&nbsp; &nbsp; &nbsp; &nbsp; :computer: **Assignees**: {", ".join(assignees)}  \n  \n')

    f.write('\n## Burn-Up Chart \n') 
    # removing this for now TODO: find a way to get issue_closed at date
    f.write(f'![Burn-Up Chart for cycle {count}](burnup_charts/burnup_chart_cycle_{count}.png)  \n  \n') 

    # AUTOMATION TODO? 
    f.write('\n## Test Reports \n') 
    
    f.write('  \n  \n') 

    f.write(old_content)
