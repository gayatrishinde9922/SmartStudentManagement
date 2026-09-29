from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
import os
from dotenv import load_dotenv

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
load_dotenv()

# MongoDB Atlas connection
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)

db = client["student_db"]
students_collection = db["students"]

# Test MongoDB connection
client.admin.command("ping")


@app.get("/")
def home():
    return {"message": "Smart Student Management System"}


class Student(BaseModel):
    name: str
    email: str
    course: str


# GET - Get all students
@app.get("/students")
def get_students():
    return list(students_collection.find({}, {"_id": 0}))


# POST - Add student
@app.post("/students")
def add_student(student: Student):

    last_student = students_collection.find_one(
        sort=[("id", -1)]
    )

    if last_student:
        new_id = last_student["id"] + 1
    else:
        new_id = 1

    new_student = {
        "id": new_id,
        "name": student.name,
        "email": student.email,
        "course": student.course
    }

    students_collection.insert_one(new_student)

    new_student.pop("_id", None)

    return {
        "message": "Student added successfully",
        "student": new_student
    }


# PUT - Update student
@app.put("/students/{student_id}")
def update_student(student_id: int, student: Student):

    result = students_collection.update_one(
        {"id": student_id},
        {
            "$set": {
                "name": student.name,
                "email": student.email,
                "course": student.course
            }
        }
    )

    if result.matched_count == 0:
        return {"message": "Student not found"}

    return {
        "message": "Student updated successfully",
        "id": student_id,
        "name": student.name,
        "email": student.email,
        "course": student.course
    }


# DELETE - Delete student
@app.delete("/students/{student_id}")
def delete_student(student_id: int):

    result = students_collection.delete_one(
        {"id": student_id}
    )

    if result.deleted_count == 0:
        return {"message": "Student not found"}

    return {
        "message": "Student deleted successfully",
        "id": student_id
    }


# GET - Student count
@app.get("/students/count")
def get_student_count():

    count = students_collection.count_documents({})

    return {
        "total_students": count
    }