# mandelbrot

If you want to launch the web application straight from your file system instead of using a web server, there are a couple of steps you'll need to take. This is because, by default, browsers will not load the web worker files from the local file system for security reasons.

To work around this in Firefox, navigate to about:config, search for security.fileuri.strict_origin_policy and set it to false. Make sure to change it back to true when you're done. (Source: https://stackoverflow.com/a/71676463)

To work around this in Chrome, launch Chrome from the command line and pass in the parameter --allow-file-access-from-files. (Source: http://www.chrome-allow-file-access-from-file.com/windows.html)

Another option is to install node.js, then navigate to the directory where the files are and run the following command:
	npx http-server



