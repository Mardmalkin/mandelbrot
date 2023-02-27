# Mandelbrot Viewer

This is a web application for viewing the Mandelbrot Set. You can find it here: https://www.mandelbrotviewer.com/

## Running the App Locally

This application is pure HTML/CSS/Javascript, which means you don't actually need a web server to run it. Just make sure all of the files are in the same folder on your computer and open up the *index.html* file in your browser. However, there is one catch. By default, browsers will not load the web worker files from the local file system. This is for security reasons. You can either work around this or use something like node.js.


### Firefox

To work around this in Firefox, navigate to *about:config*, search for *security.fileuri.strict_origin_policy* and set it to **false**. Make sure to change it back to **true** when you're done as this does create a security vulnerability.

### Chrome 
To work around this in Chrome, launch Chrome from the command line and pass in the parameter --allow-file-access-from-files. For example:

	"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --allow-file-access-from-files

### Node.js

Another option is to install node.js, then navigate to the directory where the files are and run the following command from the command line:

	npx http-server

It will give you something like this:

	http://127.0.0.1:8080

Paste that into your browser and you should be good-to-go.

