# Movie Finder System

>  This text file should mention that you have uploaded your final submission to your team’s GitHub classroom account on time (commit history should reflect this) and include a link in this text file to your submission on GitHub. 

We have uploaded our final submission to our team's GitHub classroom account on time.

The link to our submission on GitHub is:

https://github.com/unsw-cse-comp3900-9900-23T1/capstone-project-9900h14akuangbiao

We setup, build, and run this system on a ***virtual machine*** based on the ***Lubuntu 20.4.1 LTS*** virtual machine image [here](https://sourceforge.net/projects/linuxvmimages/files/VMware/L/lubuntu_20.04.1_VM.zip/download).

*The **VM image** should be imported and run using:*

**VirtualBox 6.1.22 or later** (for **Mac/Windows/Linux**) available [here](https://www.virtualbox.org/wiki/Download_Old_Builds_6_1).

Username: **lubuntu**
Password: **lubuntu**
(to become root, use **sudo su**)

## 0. Before building and running the system

Before you can build and run the Movie Finder System, you need to make sure that you have installed the following softwares/tools in the machine.

0. Firstly, update the **lubuntu**

   ```
   $ sudo apt update
   $ sudo apt upgrade
   $ sudo apt install -y curl
   ```

1. Python

   First, make sure you have Python installed. We recommend using Python 3.10.11 or higher. You can download Python from the official Python website: <https://www.python.org/downloads/>

   ```
   $ sudo apt install python3-pip
   $ python3 --version
   Python3.8.10
   ```


2. Node

   Notice: the version of the node must larger than 17.

   ```
   $ curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   $ sudo apt install -y nodejs
   $ node --version
   v18.16.0
   ```

## 1. Building the system

After install all needed softwares and tools, you can now build the Movie Finder System by following the code below:

1. Download the system code from the website: https://github.com/unsw-cse-comp3900-9900-23T1/capstone-project-9900h14akuangbiao

2. Extract the zip into a directory `capstone-project-9900h14akuangbiao-main`:

   ```
   $ unzip 9900h14akuangbiaoFinalSoftwareQuality.zip
   ```

3. `cd` into to the directory `capstone-project-9900h14akuangbiao-main`

   ```
   $ cd capstone-project-9900h14akuangbiao-main/
   ```

4. Install the dependences of the backend:

   ```
   $ pip3 install -r requirements.txt
   ```

5. Install the dependences of the frontend:

   ```
   $ cd frontend
   $ npm install
   ```

## 2. Running the system

After building the system, now you can run the Movie Finder System!

1. Run the backend

   At the system root directory `capstone-project-9900h14akuangbiao-main/`:

   ```
   $ python3 manage.py runserver
   ```

2. Run the frontend

   At the system root directory `capstone-project-9900h14akuangbiao-main/`:

   ```
   $ npm start
   ```

![VMScreenshot](./VMScreenshot.png)
