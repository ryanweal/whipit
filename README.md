# whipit

This is a simple pager tool that will send you a ping by SMS when you hit a certain URL.

## Configuration

You must craete a `.env` file with the parameters for Twilio, as well as your users:

    TWILIO_SID=string
    TWILIO_TOKEN=string
    TWILIO_FROM='+18005551212'
    USERS='username/+15145551212,user2/+13125551212'

## Usage

Send an SMS message using `wget`:

`wget -q --spider "localhost:4000/username/console-is-great 123"`

This will not produce any output and will not download the resulting file to your disk.

## Deploying to Now.sh

This package includes a deployment file for Zeit's now.sh service.

Set the environment variables for your Twilio account and your users:

`now secrets add whipit-twilio-sid <secret-value>`

`now secrets add whipit-twilio-token <secret-value>`

`now secrets add whipit-twilio-from <secret-value>`

`now secrets add whipit-users <secret-value>`

To pubish this in your now.sh account simply type `now` in the root of this project.

`now`

After doing this you can use the domain name (or alias) for your now.sh instance rather than using localhost:4000 so that you can call the whipit service from anywhere.
