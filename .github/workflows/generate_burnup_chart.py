import matplotlib.pyplot as plt
import pandas as pd
import datetime

# Sample data: dates, scope (total work), and completed work
dates = pd.date_range(start="2024-01-01", end=datetime.datetime.now(), freq='D')
scope = [50] * len(dates)  # assuming a constant scope of 50 units of work
completed = [min(50, i) for i in range(len(dates))]  # completed work increases linearly

# Create a DataFrame
data = pd.DataFrame({'Date': dates, 'Scope': scope, 'Completed': completed})

# Plot the burnup chart
plt.figure(figsize=(10, 5))
plt.plot(data['Date'], data['Scope'], label='Scope', color='red')
plt.plot(data['Date'], data['Completed'], label='Completed Work', color='green')
plt.fill_between(data['Date'], data['Completed'], data['Scope'], color='yellow', alpha=0.3)

# Adding labels and title
plt.xlabel('Date')
plt.ylabel('Work')
plt.title('Burnup Chart')
plt.legend()

# Save the plot
plt.savefig('burnup_chart.png')
