import axios, { AxiosError } from "axios";
import { STUDENT_SERVICE } from "../../constants";
import { Student } from "./interfaces/student.interface";

const BASE_URL = STUDENT_SERVICE;

export async function addStudent(student: Student): Promise<Student | any> {
  try {
    const response = await axios.post(BASE_URL, student);
    return response.data;
  } catch (error) {
    return (error as AxiosError).response?.data;
  }
}

export async function loginStudent(
  email: string,
  password: string
): Promise<Student | any> {
  try {
    const response = await axios.post(`${BASE_URL}auth/login/`, {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    return (error as AxiosError).response?.data;
  }
}

export async function getStudent(
  id: string,
  auth: string
): Promise<Student | any> {
  try {
    const response = await axios.get(`${BASE_URL}${id}`, {
      headers: { Authorization: `Bearer ${auth}` },
    });
    return response.data;
  } catch (error) {
    return (error as AxiosError).response?.data;
  }
}

export async function getStudents(
  auth: string,
  email?: string,
  name?: string
): Promise<Student | any> {
  try {
    const response = await axios.post(
      `${BASE_URL}search/`,
      { email, name },
      {
        headers: { Authorization: `Bearer ${auth}` },
      }
    );
    return response.data;
  } catch (error) {
    return (error as AxiosError).response?.data;
  }
}

export async function updateStudent(
  id: string,
  student: Student,
  auth: string
): Promise<Student | any> {
  try {
    const response = await axios.patch(`${BASE_URL}${id}`, student, {
      headers: { Authorization: `Bearer ${auth}` },
    });
    return response.data;
  } catch (error) {
    return (error as AxiosError).response?.data;
  }
}
