const apiUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000/api' // development api
    : 'https://bloom1.vercel.app/api'; // production api

export {
    apiUrl
};