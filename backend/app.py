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

@app.route('/readPosts', methods=['GET'])
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

@app.route('/addPost', methods=['POST'])
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
        read_query = "SELECT id, content, post_id FROM reply"
        cursor.execute(read_query)
        rows = cursor.fetchall()
        
        replies = []
        for row in rows:
            replies.append({
                "id": row[0],
                "content": row[1],
                "post_id": row[2]
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

    if post_id is None:
        logging.error("No id provided in request")
        return jsonify({"error": "No id provided"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        update_query = "INSERT INTO reply (post_id, content) VALUES (%s, %s)"
        cursor.execute(update_query, (post_id, reply_content))  # Ensure the id is passed as a tuple
        conn.commit()
        new_reply_id = cursor.lastrowid  # Get the last inserted ID

        # Prepare the new post data to be returned
        new_reply = {
            'id': new_reply_id,
            'content': reply_content,
            'post_id': post_id
        }

        return jsonify(new_reply), 201  # Return the new post data with status code 201

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
