from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

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
        return jsonify({'message': 'Post added successfully!'}), 201

    except Error as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()




if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
