import mysql.connector
from mysql.connector import Error

# Replace with your actual RDS endpoint, database name, username, and password
config = {
    'host': 'YOUR_ENDPOINT',
    'user': 'admin',
    'password': 'YOUR_PASSWORD',
    'database': 'YOUR_DB',  # Replace with your database name
    'port': 3306,  # Replace with your port
    'raise_on_warnings': True
}

conn = None  # Initialize the connection variable

try:
    # Establish a connection to the MySQL server
    conn = mysql.connector.connect(**config)
    if conn.is_connected():
        print("Connected to MySQL database")

        # Create a cursor object using cursor() method
        cursor = conn.cursor()

        # Create a table 'posts' if it does not exist
        # create_table_query = """
        # CREATE TABLE IF NOT EXISTS posts (
        #     id INT AUTO_INCREMENT PRIMARY KEY,
        #     title VARCHAR(255) NOT NULL,
        #     content TEXT NOT NULL
        # )
        # """
        # cursor.execute(create_table_query)
        # print("Table 'posts' created successfully or already exists")

        # Insert some sample data into the 'posts' table
        insert_query = """
        INSERT INTO posts (title, content) VALUES (%s, %s)
        """
        data = [('First Post', 'This is the content of the first post.'),
                ('Second Post', 'This is the content of the second post.')]
        cursor.executemany(insert_query, data)
        conn.commit()
        print("Data inserted successfully")

except Error as e:
    print(f"Error connecting to MySQL: {e}")

finally:
    # Closing database connection
    if conn is not None and conn.is_connected():
        cursor.close()
        conn.close()
        print("MySQL connection closed")
