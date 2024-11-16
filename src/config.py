class Config:
    PREFERRED_CENTER = 'Rabat'  # or 'Casablanca'
    VISA_TYPE = 'Short Stay Visa'
    REFRESH_INTERVAL = 300  # 5 minutes in seconds
    MAX_RETRIES = 3
    VFS_LOGIN_URL = 'https://visa.vfsglobal.com/mar/en/nld/login'
    VFS_APPOINTMENT_URL = 'https://visa.vfsglobal.com/mar/en/nld/book-an-appointment'