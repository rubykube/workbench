# Jest test suite for RKCP 

Testing of API is much more about infrastructure, then about actual API calls. First if all we should have working environment. From Now on we should refer to defaults of rubykube/workbench. It is not something, what breaks any approaches, but the conventions of naming of environment variables and constants.

From here and after we should assume, that you have installation, that contains branches called feature/vagrant from rubykube/workbench and additions we will create hereafter or by cloning.

## Why?

Reasons: we need exact versions od peatio to build test suit against. There were several braking changes in 1.5.0-4 and 1.6.0-6 that we will cover.

In this session we are going to cover 2 APIs of Peatio and one of Barong: peatio’s are members APIv 2 and Management API v1 and Barong new API for user management and sessions.

Step 1. Install insfrastructure

References: Aviad and Dima. But for local shadow testing everything can be done with docker compose.

At this step we should all refer to readme of workbench.  

The difference and aim: Create a working docker image that will connect to your environment to test it. 

For now I refer to https://github.com/serii-savchenko/workbench and branch feature/jasminetests (will be corrected asap) there is Dockerfile in jest-test folder that builds separate docker image. 

Shared configuration with peatio and barong is: 
* Members API:
  * Private keys of barong to generate JWT
  * Configuration of end points (due to several breaking changes of URLs)

How do we configure those?

The easiest way is compose/app.yaml section called "jest:"
