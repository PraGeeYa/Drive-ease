import axios from 'axios';

/**
 * apiClient - A customized Axios instance for the DriveEase system.
 * This acts as the central hub for all outgoing API requests to the backend.
 */
const apiClient = axios.create({
    // The base URL for the backend Spring Boot server.
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * REQUEST INTERCEPTOR
 * Automatically attaches the security token to every request before it leaves the browser.
 */
apiClient.interceptors.request.use(
    (config) => {
        // Retrieves the JWT security token stored during login.
        const token = localStorage.getItem('token'); 
        if (token) {
            // Injects the token into the Authorization header using Bearer format.
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handles errors that happen before the request is even sent.
        return Promise.reject(error);
    }
);

/**
 * RESPONSE INTERCEPTOR
 * Intercepts every response coming back from the server to handle security errors.
 */
apiClient.interceptors.response.use(
    (response) => response, // If the request is successful, pass the data through.
    (error) => {
        /**
         * Global 401 Unauthorized Error Handling:
         * If the server says the token is invalid or expired (Status 401),
         * we automatically boot the user out to keep the system secure.
         */
        if (error.response && error.response.status === 401) {
            // Wipes all user data and tokens from local storage.
            localStorage.clear();
            // Redirects the user back to the login page immediately.
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;