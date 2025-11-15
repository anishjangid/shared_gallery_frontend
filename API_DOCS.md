# Shared Gallery API Documentation

## Overview

The Shared Gallery API is a FastAPI-based REST API that enables users to upload, manage, and share images. The API uses JWT-based authentication and integrates with Cloudinary for image storage.

**Base URL:** `http://localhost:8000`  
**API Version:** 1.0.0  
**Interactive Documentation:** `/docs` (Swagger UI) or `/redoc` (ReDoc)

---

## Table of Contents

1. [Authentication](#authentication)
2. [General Information](#general-information)
3. [API Endpoints](#api-endpoints)
   - [General Endpoints](#general-endpoints)
   - [Authentication Endpoints](#authentication-endpoints)
   - [Image Endpoints](#image-endpoints)
   - [Sharing Endpoints](#sharing-endpoints)
4. [Data Models](#data-models)
5. [Error Responses](#error-responses)
6. [Status Codes](#status-codes)

---

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require authentication via Bearer token.

### Getting an Access Token

1. Register a new user via `POST /auth/register`
2. Login via `POST /auth/login` to receive an access token
3. Include the token in subsequent requests using the `Authorization` header:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Token Expiration

Access tokens expire after a configured time period (default: 30 minutes). After expiration, you'll need to login again to get a new token.

---

## General Information

### Request Headers

For authenticated endpoints:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

For file uploads:
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

### Response Format

All responses are in JSON format unless otherwise specified.

---

## API Endpoints

### General Endpoints

#### Get API Information

```http
GET /
```

**Description:** Returns basic API information and available documentation links.

**Authentication:** Not required

**Response:** `200 OK`
```json
{
  "message": "Welcome to Shared Gallery API",
  "docs": "/docs",
  "version": "1.0.0"
}
```

---

#### Health Check

```http
GET /health
```

**Description:** Returns the health status of the API.

**Authentication:** Not required

**Response:** `200 OK`
```json
{
  "status": "healthy"
}
```

---

### Authentication Endpoints

#### Register User

```http
POST /auth/register
```

**Description:** Creates a new user account.

**Authentication:** Not required

**Request Body:**
```json
{
  "username": "string",
  "email": "user@example.com",
  "password": "string"
}
```

**Request Schema:**
- `username` (string, required): Unique username (max 50 characters)
- `email` (string, required): Valid email address (unique)
- `password` (string, required): User password

**Response:** `201 Created`
```json
{
  "user_id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2024-01-01T12:00:00"
}
```

**Error Responses:**
- `400 Bad Request`: Username or email already registered
- `422 Unprocessable Entity`: Validation error

---

#### Login

```http
POST /auth/login
```

**Description:** Authenticates a user and returns an access token.

**Authentication:** Not required

**Request Body:** (Form Data)
```
username: string
password: string
```

**Note:** This endpoint uses OAuth2 password flow with form data, not JSON.

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Error Responses:**
- `401 Unauthorized`: Incorrect username or password
- `422 Unprocessable Entity`: Validation error

**Example cURL:**
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=john_doe&password=securepassword123"
```

---

### Image Endpoints

All image endpoints require authentication.

#### Upload Image

```http
POST /images/upload
```

**Description:** Uploads an image to Cloudinary and saves metadata to the database.

**Authentication:** Required

**Request:** Multipart Form Data
- `file` (file, required): Image file (must be a valid image type)
- `caption` (string, optional): Image caption
- `visibility` (enum, optional): Image visibility - `"public"` or `"private"` (default: `"private"`)

**Query Parameters:**
- `caption` (string, optional): Image caption
- `visibility` (string, optional): `"public"` or `"private"` (default: `"private"`)

**Response:** `201 Created`
```json
{
  "image_id": 1,
  "image_url": "https://res.cloudinary.com/...",
  "caption": "My beautiful image",
  "visibility": "private",
  "message": "Image uploaded successfully"
}
```

**Error Responses:**
- `400 Bad Request`: File is not an image or file is empty
- `401 Unauthorized`: Authentication required
- `500 Internal Server Error`: Cloudinary configuration error or upload failure

**Example cURL:**
```bash
curl -X POST "http://localhost:8000/images/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "caption=My beautiful image" \
  -F "visibility=private"
```

---

#### Get My Images

```http
GET /images/my-images
```

**Description:** Retrieves all images uploaded by the authenticated user.

**Authentication:** Required

**Response:** `200 OK`
```json
[
  {
    "image_id": 1,
    "user_id": 1,
    "image_url": "https://res.cloudinary.com/...",
    "caption": "My image",
    "visibility": "private",
    "created_at": "2024-01-01T12:00:00",
    "owner_username": "john_doe"
  }
]
```

**Error Responses:**
- `401 Unauthorized`: Authentication required

---

#### Get Public Images

```http
GET /images/public
```

**Description:** Retrieves all images with public visibility from all users.

**Authentication:** Required

**Response:** `200 OK`
```json
[
  {
    "image_id": 2,
    "user_id": 3,
    "image_url": "https://res.cloudinary.com/...",
    "caption": "Public image",
    "visibility": "public",
    "created_at": "2024-01-01T12:00:00",
    "owner_username": "jane_doe"
  }
]
```

**Error Responses:**
- `401 Unauthorized`: Authentication required

---

#### Get Image by ID

```http
GET /images/{image_id}
```

**Description:** Retrieves a specific image if the user has access to it.

**Authentication:** Required

**Path Parameters:**
- `image_id` (integer, required): ID of the image

**Response:** `200 OK`
```json
{
  "image_id": 1,
  "user_id": 1,
  "image_url": "https://res.cloudinary.com/...",
  "caption": "My image",
  "visibility": "private",
  "created_at": "2024-01-01T12:00:00",
  "owner_username": "john_doe"
}
```

**Access Rules:**
- User owns the image, OR
- Image has public visibility, OR
- Image has been shared with the user

**Error Responses:**
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: User doesn't have access to this image
- `404 Not Found`: Image not found

---

#### Delete Image

```http
DELETE /images/{image_id}
```

**Description:** Deletes an image. Only the owner can delete their images.

**Authentication:** Required

**Path Parameters:**
- `image_id` (integer, required): ID of the image to delete

**Response:** `204 No Content`

**Error Responses:**
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: User can only delete their own images
- `404 Not Found`: Image not found

**Note:** Deleting an image also removes all associated shared access records (CASCADE delete).

---

### Sharing Endpoints

All sharing endpoints require authentication.

#### Share Image with User

```http
POST /sharing/share/{image_id}
```

**Description:** Shares an image with another user by username.

**Authentication:** Required

**Path Parameters:**
- `image_id` (integer, required): ID of the image to share

**Request Body:**
```json
{
  "shared_with_username": "string"
}
```

**Request Schema:**
- `shared_with_username` (string, required): Username of the user to share with

**Response:** `200 OK`
```json
{
  "message": "Image shared successfully",
  "shared_with_username": "jane_doe",
  "image_id": 1
}
```

**Error Responses:**
- `400 Bad Request`: Cannot share with yourself or image already shared with this user
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Can only share your own images
- `404 Not Found`: Image not found or user not found

**Example cURL:**
```bash
curl -X POST "http://localhost:8000/sharing/share/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"shared_with_username": "jane_doe"}'
```

---

#### Get Images Shared With Me

```http
GET /sharing/shared-with-me
```

**Description:** Retrieves all images that have been shared with the authenticated user.

**Authentication:** Required

**Response:** `200 OK`
```json
[
  {
    "access_id": 1,
    "image_id": 1,
    "shared_with_user_id": 2,
    "shared_with_username": "jane_doe",
    "image_url": "https://res.cloudinary.com/...",
    "image_caption": "Shared image",
    "granted_at": "2024-01-01T12:00:00"
  }
]
```

**Error Responses:**
- `401 Unauthorized`: Authentication required

**Note:** The `shared_with_username` in the response is the current authenticated user's username.

---

#### Get Images Shared By Me

```http
GET /sharing/shared-by-me
```

**Description:** Retrieves all images that the authenticated user has shared with others.

**Authentication:** Required

**Response:** `200 OK`
```json
[
  {
    "access_id": 1,
    "image_id": 1,
    "shared_with_user_id": 2,
    "shared_with_username": "jane_doe",
    "image_url": "https://res.cloudinary.com/...",
    "image_caption": "My shared image",
    "granted_at": "2024-01-01T12:00:00"
  }
]
```

**Error Responses:**
- `401 Unauthorized`: Authentication required

**Note:** The `shared_with_username` in the response is the username of the user the image was shared with.

---

#### Unshare Image

```http
DELETE /sharing/unshare/{image_id}/{shared_with_user_id}
```

**Description:** Removes sharing access for a specific user from an image.

**Authentication:** Required

**Path Parameters:**
- `image_id` (integer, required): ID of the image
- `shared_with_user_id` (integer, required): ID of the user to remove sharing access from

**Response:** `204 No Content`

**Error Responses:**
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Can only unshare your own images
- `404 Not Found`: Image not found or shared access not found

---

## Data Models

### User Models

#### UserCreate
```json
{
  "username": "string",
  "email": "string (email format)",
  "password": "string"
}
```

#### UserResponse
```json
{
  "user_id": 0,
  "username": "string",
  "email": "string",
  "created_at": "2024-01-01T12:00:00"
}
```

---

### Authentication Models

#### Token
```json
{
  "access_token": "string",
  "token_type": "string"
}
```

---

### Image Models

#### ImageCreate
```json
{
  "caption": "string (optional)",
  "visibility": "public" | "private"
}
```

#### ImageResponse
```json
{
  "image_id": 0,
  "user_id": 0,
  "image_url": "string",
  "caption": "string (nullable)",
  "visibility": "public" | "private",
  "created_at": "2024-01-01T12:00:00",
  "owner_username": "string (nullable)"
}
```

#### ImageUploadResponse
```json
{
  "image_id": 0,
  "image_url": "string",
  "caption": "string (nullable)",
  "visibility": "public" | "private",
  "message": "string"
}
```

**Visibility Enum:**
- `"public"`: Visible to all authenticated users
- `"private"`: Only visible to owner and users with shared access

---

### Sharing Models

#### ShareImageRequest
```json
{
  "shared_with_username": "string"
}
```

#### ShareImageResponse
```json
{
  "message": "string",
  "shared_with_username": "string",
  "image_id": 0
}
```

#### SharedAccessResponse
```json
{
  "access_id": 0,
  "image_id": 0,
  "shared_with_user_id": 0,
  "shared_with_username": "string",
  "image_url": "string",
  "image_caption": "string (nullable)",
  "granted_at": "2024-01-01T12:00:00"
}
```

---

## Error Responses

All error responses follow a consistent format:

### Standard Error Response
```json
{
  "detail": "Error message description"
}
```

### Common Error Scenarios

#### 400 Bad Request
```json
{
  "detail": "Username already registered"
}
```

#### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```
**Headers:** `WWW-Authenticate: Bearer`

#### 403 Forbidden
```json
{
  "detail": "You don't have access to this image"
}
```

#### 404 Not Found
```json
{
  "detail": "Image not found"
}
```

#### 422 Unprocessable Entity
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

#### 500 Internal Server Error
```json
{
  "detail": "Error uploading image: [error message]"
}
```

---

## Status Codes

| Status Code | Description |
|------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no response body |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Authentication required or invalid token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error - Server error |

---

## Example Workflow

### 1. Register a New User
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### 2. Login to Get Access Token
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=john_doe&password=securepassword123"
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. Upload an Image
```bash
curl -X POST "http://localhost:8000/images/upload" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "file=@image.jpg" \
  -F "caption=My first image" \
  -F "visibility=private"
```

### 4. View My Images
```bash
curl -X GET "http://localhost:8000/images/my-images" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 5. Share Image with Another User
```bash
curl -X POST "http://localhost:8000/sharing/share/1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"shared_with_username": "jane_doe"}'
```

### 6. View Images Shared With Me
```bash
curl -X GET "http://localhost:8000/sharing/shared-with-me" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Notes

- **Image Storage:** Images are uploaded to Cloudinary and public URLs are stored in the database
- **Visibility:** Private images are only visible to the owner and users with shared access. Public images are visible to all authenticated users
- **Cascade Deletes:** When an image is deleted, all associated shared access records are automatically deleted
- **Token Security:** Keep access tokens secure and don't expose them in client-side code
- **File Types:** Only image files are accepted for upload (content-type must start with `image/`)
- **CORS:** The API is configured with CORS middleware allowing all origins (configure appropriately for production)

---

## Additional Resources

- **Interactive API Documentation:** `http://localhost:8000/docs` (Swagger UI)
- **Alternative Documentation:** `http://localhost:8000/redoc` (ReDoc)
- **OpenAPI Schema:** `http://localhost:8000/openapi.json`

