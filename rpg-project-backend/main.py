from aplication import app, db

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables if they don't exist
    app.run(debug=True)
    print("Server is running on http://localhost:5000")