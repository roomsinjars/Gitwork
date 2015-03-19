1. mkdir node_modules
2. cd node_modules
3. git clone https://github.com/nodegit/nodegit.git
4. cd nodegit
5. npm install (you can cancel this once it says "Building Native Node")
6. sudo npm install -g nw-gyp
7. npm run generateNativeCode
8. sudo nw-gyp rebuild --target=0.12.0