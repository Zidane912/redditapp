from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import mysql.connector
from mysql.connector import Error
import logging
import os

app = Flask(__name__)
CORS(app)


database_url = os.getenv('DATABASE_URL')
password = os.getenv('PASSWORD')

config = {
    'host': database_url,
    'user': 'admin',
    'password': password,
    'database': 'posts',
    'port': 3306,
    'raise_on_warnings': True
}


def get_db_connection():
    conn = mysql.connector.connect(**config)
    return conn


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    hashed_password = generate_password_hash(password)
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        insert_query = "INSERT INTO users (username, password) VALUES (%s, %s)"
        cursor.execute(insert_query, (username, hashed_password))
        conn.commit()
        
        return jsonify({"message": "User registered successfully"}), 201

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()


@app.route('/signIn', methods=['POST'])
def signIn():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        select_query = "SELECT user_id, password FROM users WHERE username = %s"
        cursor.execute(select_query, (username,))
        row = cursor.fetchone()
        
        if row and check_password_hash(row[1], password):
            user_id = row[0]
            return jsonify({"authenticated": True, "user": {"username": username, "user_id": user_id}}), 200
        else:
            return jsonify({"authenticated": False, "message": "Invalid credentials"}), 401

    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()




@app.route('/readPosts', methods=['GET'])
def get_post():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        read_query = """
        SELECT posts.id, posts.title, posts.content, users.username
        FROM posts
        JOIN users ON posts.user_id = users.user_id
        """
        cursor.execute(read_query)
        rows = cursor.fetchall()
        
        posts = []
        for row in rows:
            posts.append({
                "id": row[0],
                "title": row[1],
                "content": row[2],
                "username": row[3]
            })
        
        return jsonify(posts)

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/addPost', methods=['POST'])
def add_post():
    data = request.json
    title = data.get('title')
    content = data.get('content')
    user_id = data.get('user_id')

    if not title or not content or not user_id:
        return jsonify({'error': 'Title, content, and user ID are required'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        insert_query = "INSERT INTO posts (title, content, user_id) VALUES (%s, %s, %s)"
        cursor.execute(insert_query, (title, content, user_id))
        conn.commit()
        new_post_id = cursor.lastrowid  # Get the last inserted ID

        read_query = """
        SELECT posts.id, posts.title, posts.content, posts.user_id, users.username
        FROM posts
        JOIN users ON posts.user_id = users.user_id
        WHERE posts.id = %s;
        """

        cursor.execute(read_query, (new_post_id,))
        rows = cursor.fetchall()
        
        new_post = []
        for row in rows:
            new_post.append({
                "id": row[0],
                "title": row[1],
                "content": row[2],
                "user_id": row[3],
                "username": row[4]
            })
        
        return jsonify(new_post), 201

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()




@app.route('/deletePost', methods=['POST'])
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

        # Check the count of replies associated with the post
        check_replies_query = "SELECT COUNT(*) FROM reply WHERE post_id = %s"
        cursor.execute(check_replies_query, (post_id,))
        reply_count = cursor.fetchone()[0]
        logging.debug(f"Number of replies for post ID {post_id}: {reply_count}")

        # If there are replies, delete them first
        if reply_count > 0:
            delete_replies_query = "DELETE FROM reply WHERE post_id = %s"
            cursor.execute(delete_replies_query, (post_id,))
            logging.debug(f"Deleted {reply_count} replies for post ID {post_id}")

        # Delete the post
        delete_post_query = "DELETE FROM posts WHERE id = %s"
        cursor.execute(delete_post_query, (post_id,))
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



@app.route('/editPost', methods=['POST'])
def edit_post():
    data = request.json
    logging.debug(f"Received data: {data}")

    post_id = data.get('id')
    post_title = data.get('title')
    post_content = data.get('content')

    if post_id is None:
        logging.error("No id provided in request")
        return jsonify({"error": "No id provided"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        update_query = "UPDATE posts SET title = %s, content = %s WHERE id = %s"
        cursor.execute(update_query, (post_title, post_content, post_id))  # Ensure the id is passed as a tuple
        conn.commit()

        # Prepare the new post data to be returned
        new_post = {
            'id': post_id,
            'title': post_title,
            'content': post_content
        }

        return jsonify(new_post), 201  # Return the new post data with status code 201

    except Error as e:
        logging.error(f"Database error: {str(e)}")
        return jsonify({'error': str(e)}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            logging.debug("Database connection closed")


# reply queries

@app.route('/readReplies', methods=['GET'])
def get_replies():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        read_query = """
        SELECT reply.id, reply.content, reply.post_id, users.username
        FROM reply
        JOIN users ON reply.user_id = users.user_id
        """
        cursor.execute(read_query)
        rows = cursor.fetchall()
        
        replies = []
        for row in rows:
            replies.append({
                "id": row[0],
                "content": row[1],
                "post_id": row[2],
                "username": row[3]
            })
        
        return jsonify(replies)

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()




@app.route('/addReply', methods=['POST'])
def add_reply():
    data = request.json
    logging.debug(f"Received data: {data}")

    post_id = data.get('post_id')
    reply_content = data.get('content')
    user_id = data.get('user_id')

    if not post_id or not reply_content or not user_id:
        logging.error("Post ID, content, and user ID are required")
        return jsonify({"error": "Post ID, content, and user ID are required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        update_query = "INSERT INTO reply (post_id, content, user_id) VALUES (%s, %s, %s)"
        cursor.execute(update_query, (post_id, reply_content, user_id))  # Ensure the id is passed as a tuple
        conn.commit()
        new_reply_id = cursor.lastrowid  # Get the last inserted ID

        read_query = """
        SELECT reply.id, reply.content, reply.post_id, reply.user_id, users.username
        FROM reply
        JOIN users ON reply.user_id = users.user_id
        WHERE reply.id = %s
        """
        cursor.execute(read_query, (new_reply_id,))
        rows = cursor.fetchall()
        
        new_reply = []
        for row in rows:
            new_reply.append({
                "id": row[0],
                "content": row[1],
                "post_id": row[2],
                "user_id": row[3],
                "username": row[4]
            })
        
        return jsonify(new_reply), 201

    except Error as e:
        logging.error(f"Database error: {str(e)}")
        return jsonify({'error': str(e)}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            logging.debug("Database connection closed")



@app.route('/deleteReply', methods=['POST'])
def delete_reply():
    data = request.json
    logging.debug(f"Received data: {data}")

    reply_id = data.get('id')
    logging.debug(f"Post ID: {reply_id}")

    if reply_id is None:
        logging.error("No id provided in request")
        return jsonify({"error": "No id provided"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        delete_query = "DELETE FROM reply WHERE id = %s"
        cursor.execute(delete_query, (reply_id,))  # Ensure the id is passed as a tuple
        conn.commit()
        logging.debug(f"Deleted post with ID: {reply_id}")

    except Error as e:
        logging.error(f"Database error: {str(e)}")
        return jsonify({'error': str(e)}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            logging.debug("Database connection closed")

    return jsonify({"message": "Post deleted successfully"}), 200

@app.route('/editReply', methods=['POST'])
def edit_reply():
    data = request.json
    logging.debug(f"Received data: {data}")


    reply_id = data.get('reply_id')
    content = data.get('content')
    post_id = data.get('post_id')

    if reply_id is None:
        logging.error("No id provided in request")
        return jsonify({"error": "No id provided"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        update_query = "UPDATE reply SET content = %s WHERE id = %s"
        cursor.execute(update_query, (content, reply_id))  # Ensure the id is passed as a tuple
        conn.commit()

        # Prepare the new post data to be returned
        edited_reply = {
            'id': reply_id,
            'content': content,
            'post_id': post_id
        }

        return jsonify(edited_reply), 201  # Return the new post data with status code 201

    except Error as e:
        logging.error(f"Database error: {str(e)}")
        return jsonify({'error': str(e)}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            logging.debug("Database connection closed")

if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    app.run(debug=True)
