from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Initialize Selenium WebDriver
driver = webdriver.Chrome()

# Navigate to the webpage
driver.get("https://leetcode.com/progress/")

# Wait for question elements to load
question_elements = WebDriverWait(driver, 10).until(
    EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'a[href*="/problems/"]'))
)

# Extract question topics
question_topics = [element.text for element in question_elements]

# Print the extracted data
print(question_topics)

# Compare with expected results
expected_results = ['9. Palindrome Number', '10. Regular Expression Matching']
if question_topics == expected_results:
    print("Extraction successful. Extracted data matches expected results.")
else:
    print("Extraction failed. Extracted data does not match expected results.")

# Manually inspect the extracted data
print("Please inspect the extracted data manually.")

# Close the WebDriver
driver.quit()
