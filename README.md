# Garage Gym Project Information

**University Name**: [San Jose State Unversity](http://www.sjsu.edu/ "SJSU Home Page")

**Project URL**: [Garage Gym](http://gg.ramyaprojects.net "Garage Gym Home Page")

**Course**: Cloud Technologies

**Professor**: [Sanjay Garje](https://www.linkedin.com/in/sanjaygarje/ "LinkedIn to Prof. Sanjay Garje's Profile") 

**Students**:

* [Ramya Kandasamy](https://www.linkedin.com/in/ramyakandasamy/ "Ramya's LinkedIn")

* [Jed Villanueva](https://www.linkedin.com/in/jed-v/ "Jed's LinkedIn")

* [Raymond Ho](https://www.linkedin.com/in/raymond-ho-9b3980163/ "Raymond's LinkedIn")

**Project Introduction**

GymGarage is an online-platform that connects local gym owners to gym enthusiasts. Gym owners can list their home gyms (along with description and cost per use) and decline/accept requests. Gym enthusiasts can search for gyms, submit requests, and do payment all on this platform. 

**Sample Demo Screenshots**

Login and Registration
<img width="1144" alt="Screen Shot 2019-12-08 at 3 10 27 PM" src="https://user-images.githubusercontent.com/36056493/70399043-cb6f0300-19d5-11ea-8ba1-da489900b0ff.png"> 

<img width="498" alt="Screen Shot 2019-12-08 at 3 11 24 PM" src="https://user-images.githubusercontent.com/36056493/70399068-f9ecde00-19d5-11ea-89c2-d3a470be7d34.png">

<img width="407" alt="Screen Shot 2019-12-08 at 3 16 06 PM" src="https://user-images.githubusercontent.com/36056493/70399077-0a04bd80-19d6-11ea-90ac-39a77b29d70d.png">

Administrator Capabilities:

Upload Gym

<img width="400" alt="Screen Shot 2019-12-08 at 3 17 55 PM" src="https://user-images.githubusercontent.com/36056493/70399092-27d22280-19d6-11ea-9e5c-e98641b0b039.png">

Accept/Decline Requests
<img width="1452" alt="Screen Shot 2019-12-08 at 3 18 42 PM" src="https://user-images.githubusercontent.com/36056493/70399147-6962cd80-19d6-11ea-8087-b5ceaa2d93e3.png">

Receive Emails when a Reservation has been made
<img width="528" alt="Screen Shot 2019-12-08 at 3 19 23 PM" src="https://user-images.githubusercontent.com/36056493/70399165-813a5180-19d6-11ea-85fe-1d9f4291c2a8.png">

User Capabilities:

Search and Select a Gym
<img width="400" alt="Screen Shot 2019-12-08 at 3 32 12 PM" src="https://user-images.githubusercontent.com/36056493/70399191-b0e95980-19d6-11ea-88c0-2ccbad46bf45.png">

<img width="915" alt="Screen Shot 2019-12-08 at 3 34 17 PM" src="https://user-images.githubusercontent.com/36056493/70399205-ca8aa100-19d6-11ea-8a8b-1ab5e74f3903.png">

Pay for Gym

<img width="300" alt="Screen Shot 2019-12-08 at 3 35 37 PM" src="https://user-images.githubusercontent.com/36056493/70399217-de360780-19d6-11ea-9b54-d81f3589bb2b.png">

<img width="300" alt="Screen Shot 2019-12-08 at 3 35 59 PM" src="https://user-images.githubusercontent.com/36056493/70399219-e2fabb80-19d6-11ea-841b-1c116677937a.png">

Cancel Request:

<INSERT>

**Pre-requisites Set Up**

Here include bullet point list of resources one need to configure in their cloud account. (E.g. For AWS: S3 buckets, CloudFront etc):
* S3 bucket
* CloudFront
* EC2s: 2 ECs per region with load balancer in each region (us-west & us-east)
* Route 53
* DynamoDB - 5 Tables with Global Table Configuration
* Lambda/SNS (in development)

List of required software to download locally (E.g. Spring, JDK, Eclipse IDE etc. )

## Required Software To Run Locally

#### Software Requirements

* Ubuntu 18.04 EC2

* Git

* NodeJS

* Apache2

* PHP

* vim/nano

#### Local Configuration

1. Clone/fork the repository from github.

`$ git clone https://github.com/ramyakandasamy7/project2Cloud.git`

2. Install all necessary software

`$ sudo apt update; sudo apt install nodejs apache2 php`

3. Go into project2Cloud/ramyasAPIs and project2Cloud/raymondsAPIs and install the dependencies

```
$ cd project2Cloud/ramyasAPIs
$ npm install
$cd ../raymondsAPIs
$npm install
```

4. Point Apache2 /var/www/html directory to project2Cloud/jedsUI. Look at /etc/apache/apache.conf and add the following to the tag `<Directory /var/www/>`

```
<Directory /var/www/>
        Options Indexes FollowSymLinks
        AllowOverride None
        Require all granted
        Header always set Access-Control-Allow-Origin "*"
        Header always set Access-Control-Allow-Methods "POST, GET, OPTIONS, DELETE, PUT"
        Header always set Access-Control-Max-Age "1000"
        Header always set Access-Control-Allow-Headers "x-requested-with, Content-Type, origin, authorization, accept, client-security-token"
</Directory>
```
`$ sudo ln -s /home/ubuntu/project2Cloud/jedsUI /var/www/html`

Note: You may need to delete the /var/www/html directory first.

5. Restart Apache2. The root directory of Apache should point to jedsUI directory now which is where the homepage of the project resides. You may open a browser and check localhost. 

`$ sudo service apache2 restart`

#### Another important NOTE: Because the UI uses each EC2's public IP to make API calls, the application will only fully work in an EC2 with public IP.

#### Yet another important NOTE: API keys and secret keys are not included in the code, so really, without them, you can only look at the front page of the project.
