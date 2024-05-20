*Notes:*

[Admin Login](https://share-more-backend-1.onrender.com/api/admin/login) => *Email:* **admin@gmail.com** *Password:* **admin123**
https://share-more-backend-1.onrender.com/api/admin/login

[User Signup](https://share-more-backend-1.onrender.com/api/user/signup) 
https://share-more-backend-1.onrender.com/api/user/signup

[User Login](https://share-more-backend-1.onrender.com/api/user/login) 
https://share-more-backend-1.onrender.com/api/user/login

Looking for Blood [Blood Search](https://share-more-backend-1.onrender.com/api/blood/search)

Donor Signup: [Donor Signup](https://share-more-backend-1.onrender.com/api/donor/signup)
Donor Login: [Donor Login](https://share-more-backend-1.onrender.com/api/donor/login)
Donor Get Data: [Donor Get Data](https://share-more-backend-1.onrender.com/api/donor/get_donor/data)
Donor Edit ID: [Donor Edit ID](https://share-more-backend-1.onrender.com/api/donor/:id)
Donor Update: [Donor Update](https://share-more-backend-1.onrender.com/api/donor/edit/:id)
Donor Delete: [Donor Delete](https://share-more-backend-1.onrender.com/api/donor/delete/:id)


Based on CRON, there is no need to trigger any API; it will run automatically every day.

Appointment Booking: [Appointment Booking](https://share-more-backend-1.onrender.com/api/blood_donor_appointment/booking)
Appointment Booking Info: [Appointment Booking Info](https://share-more-backend-1.onrender.com/api/blood_donor_appointment/get_booking_info)
Appointment Booking All Info: [Appointment Booking All Info](https://share-more-backend-1.onrender.com/api/blood_donor_appointment/all_appoinment_list)

Camp Schedule
Camp Schedule Create: [Camp Schedule Create](https://share-more-backend-1.onrender.com/api/camp_schedule/create)
Camp Schedule All List: [Camp Schedule All List](https://share-more-backend-1.onrender.com/api/camp_schedule/list)
Camp Schedule Edit by ID Info: [Camp Schedule Edit by ID Info](https://share-more-backend-1.onrender.com/api/camp_schedule/:id)
Camp Schedule Update: [Camp Schedule Update](https://share-more-backend-1.onrender.com/api/camp_schedule/edit/:id)
Camp Schedule Delete: [Camp Schedule Delete](https://share-more-backend-1.onrender.com/api/camp_schedule/delete/:id)

**User:**
User can register and login themselves. 
Users can donate funds and search for blood donors, among other things.

**ADMIN:** 
Admins can register users if they are unable to register themselves.
In the Admin panel, Admins can DELETE, EDIT, CREATE, and READ user profiles.

In the Admin panel, Admins can register blood donors.
Admins can DELETE, EDIT, and CREATE donor profiles.

In the Admin panel, Admins can create camp schedules.
Admins can DELETE, EDIT, and CREATE camp schedules.

Appointment: Based on the appointment selected by the user, a reminder method will send an email or SMS one day before using the CRON job.

