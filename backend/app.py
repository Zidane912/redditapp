from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import logging

app = Flask(__name__)
CORS(app)

config = {
    'host': 'redditdb.ceqctovrsej2.eu-west-2.rds.amazonaws.com',
    'user': 'admin',
    'password': 'Qwerty123!',
    'database': 'posts',
    'port': 3306,
    'raise_on_warnings': True
}


def get_db_connection():
    conn = mysql.connector.connect(**config)
    return conn

@app.route('/read', methods=['GET'])
def get_post():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        read_query = "SELECT id, title, content FROM posts"
        cursor.execute(read_query)
        rows = cursor.fetchall()
        
        posts = []
        for row in rows:
            posts.append({
                "id": row[0],
                "title": row[1],
                "content": row[2]
            })
        
        return jsonify(posts)

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/post', methods=['POST'])
def add_post():
    data = request.json
    title = data.get('title')
    content = data.get('content')

    if not title or not content:
        return jsonify({'error': 'Title and content are required'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        insert_query = "INSERT INTO posts (title, content) VALUES (%s, %s)"
        cursor.execute(insert_query, (title, content))
        conn.commit()
        new_post_id = cursor.lastrowid  # Get the last inserted ID

        # Return the new post data
        new_post = {
            'id': new_post_id,
            'title': title,
            'content': content
        }

        return jsonify(new_post), 201

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()



@app.route('/delete', methods=['POST'])
def delete_post():
    data = request.json
    logging.debug(f"Received data: {data}")

    post_id = data.get('id')
    logging.debug(f"Post ID: {post_id}")

    if post_id is None:
        logging.error("No id provided in request")
        return jsonify({"error": "No id provided"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        delete_query = "DELETE FROM posts WHERE id = %s"
        cursor.execute(delete_query, (post_id,))  # Ensure the id is passed as a tuple
        conn.commit()
        logging.debug(f"Deleted post with ID: {post_id}")

    except Error as e:
        logging.error(f"Database error: {str(e)}")
        return jsonify({'error': str(e)}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            logging.debug("Database connection closed")

    return jsonify({"message": "Post deleted successfully"}), 200


if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    app.run(debug=True)
