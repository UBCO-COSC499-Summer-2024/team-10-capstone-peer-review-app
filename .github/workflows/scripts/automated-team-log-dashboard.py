from github import Github
from datetime import datetime, timedelta
from pytz import timezone
import os
import requests

# PAT for the automated-log-workflow
g = Github(os.getenv('AUTOMATED_LOG_TOKEN'))
# Repo for the workflow
tz = timezone('America/Vancouver')

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

# Get cycle number
try:
    with open('.github/workflows/scripts/count-for-cycle.txt', 'r') as f:
        count = int(f.read())
except FileNotFoundError:
    raise ValueError('FILE R/W ERR') 

# Write the logs to single files
team_log = 'weekly_logs/team_log.md'
team_dashboard = 'weekly_logs/team_dashboard.md'

# Read existing content from files to append to bottom
with open(team_log, 'r') as f:
    previous_team_log_entry = f.read()

with open(team_dashboard, 'r') as f:
    previous_team_dashboard_entry = f.read()

teamCount = count + 1; 

# Write the log templates to top of the file
with open(team_log, 'w') as f:
    f.write(f'\n# Team 10\'s Team Log for Cycle {teamCount}\n\n')
    f.write(f'\n## {start_date.strftime("%A, %B %d, %Y, %I:%M %p")} - {end_date.strftime("%A, %B %d, %Y, %I:%M %p")}\n\n')
    
    f.write(f'\n## Tasks currently in the Backlog for c-{teamCount}:\n')

    f.write(f'![Tasks in Backlog for c-{teamCount}](./team_log_images/backlog_issues/backlog_issues_c{teamCount}.png)  \n  \n') 


    f.write(f'\n## Tasks currently in Progress for c-{teamCount}:\n')

    f.write(f'![Tasks in progress for c-{teamCount}](./team_log_images/in_progress_issue/in_progress_issues_c{teamCount}.png)  \n  \n') 


    f.write(f'\n## Tasks currently in Review for c-{teamCount}:\n')

    f.write(f'![Tasks in review for c-{teamCount}](./team_log_images/in_review_issues/in_review_issues_c{teamCount}.png)  \n  \n') 


    f.write(f'\n## Tasks Done for c-{teamCount}:\n')

    f.write(f'![Tasks done for c-{teamCount}](./team_log_images/done_issues/done_issues_c{teamCount}.png)  \n  \n') 


    f.write('\n## Overall Burn-up Chart of Tasks\n') 

    f.write(f'![Burn-Up Chart for c-{teamCount}](./team_log_images/burnup_charts/burnup_chart_c{teamCount}.png)  \n  \n') 


    f.write(f'\n## Test Reports for c-{teamCount}\n')  

    f.write(f'\n#### Front-end Testing for c-{teamCount}\n')

    f.write(f'![Front-end Tests for c-{teamCount}](./team_log_images/front_end_tests/front_end_tests_c{teamCount}.png)  \n  \n')

    f.write(f'\n#### Back-end Testing for c-{teamCount}\n')

    f.write(f'![Burn-Up Chart for c-{teamCount}](./team_log_images/back_end_tests/back_end_tests_c{teamCount}.png)  \n  \n')

    
    f.write('  \n  \n') 

    f.write(previous_team_log_entry)

with open(team_dashboard, 'w') as f:
      # Write the log template to top of the file
    f.write(f'\n# Team 10\'s Team Dashboard for Cycle {teamCount}\n\n')
    f.write(f'\n## {start_date.strftime("%A, %B %d, %Y, %I:%M %p")} - {end_date.strftime("%A, %B %d, %Y, %I:%M %p")}\n\n')
    
    # Write all issues worked on
    f.write(f'\n### Major features worked on in c-{teamCount}\n')
    f.write('*  \n  \n')
    f.write('*  \n  \n')
    f.write('*  \n  \n')

    f.write(f'\n### Major features completed in c-{teamCount}\n')
    f.write('*  \n  \n')
    f.write('*  \n  \n')
    f.write('*  \n  \n')

    f.write(f'\n### Major features to work on for c-{teamCount+1}\n')
    f.write('*  \n  \n')
    f.write('*  \n  \n')
    f.write('*  \n  \n')

    f.write(f'\n### Team Issues and Hurdles for c-{teamCount+1}\n')
    f.write('*  \n  \n')
    f.write('*  \n  \n')
    f.write('*  \n  \n')

    f.write('\n### Clockify Dashboard for this Week\n')
    f.write(f'\n![Clockify Dashboard for c-{teamCount}](./team_dashboard_images/clockify_dashboards/clockify_dashboard_c{teamCount}.png)\n')

    f.write('  \n  \n')

    f.write(previous_team_dashboard_entry)
