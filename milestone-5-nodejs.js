const expressModule = require('express')
const corsModule = require('cors');
const expressHandler = expressModule()
const bodyPareser = require('body-parser')
const axiosModule = require('axios')
const axios = axiosModule.default
const sqlite3Handler = require('sqlite3').verbose();

let dbHandler = new sqlite3Handler.Database('system_db', (connectionError)=>{
    if (connectionError){
        console.log(connectionError.message)
    }
    else {
        console.log('connected to the database')
    }
});


expressHandler.use(corsModule())
expressHandler.use(bodyPareser.urlencoded({extended: false}))
expressHandler.use(bodyPareser.json()); // <--- Here
// expressHandler.use(bodyPareser.ajax());
// app.use(bodyParser.urlencoded({extended: true}));

// List All users in the Database
/**
 * @swagger
 * /users:
 *  get:
 *     name: List all Users
 *     summary: List All Users
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Users fetched from db
 *       '404':
 *         description: No users in db with that name
 *       '500':
 *         description: Problem communicating with db
 */
expressHandler.get('/post', function (requestObject, responseObject){
    dbHandler.all('SELECT * FROM users', (selectError, result)=>{
        resultObject = {'error': "", 'data': ""}
        if (selectError){
            resultObject.error = selectError
            resultObject.data = ""
        }
        else{
            resultObject.data = result
        }
    })
});

// Get user Profile
/**
 * @swagger
 * /users/{id}:
 *  get:
 *     name: Get user Profile
 *     summary: Get User Profile
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required:
 *           - id
 *     responses:
 *       '200':
 *         description: User fetched from db
 *       '404':
 *         description: No user in db with that name
 *       '500':
 *         description: Problem communicating with db
 */

expressHandler.get('/post/:id', function (requestObject, responseObject){
    console.log('user id', requestObject.params.id)
    dbHandler.all('select * from users where userID = ?', [requestObject.params.id], (selectError, result)=>{
        resultObject = {'error': "", 'data': ""}
        if (selectError){
            resultObject.error = selectError
            resultObject.data = ""
        }
        else{
            resultObject.data = result
        }
    })
})

// Delete user Profile
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     name: Delete User
 *     summary: Delete user
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required:
 *           - id
 *     responses:
 *       '200':
 *         description: User deleted from db
 *       '404':
 *         description: No user in db with that name
 *       '500':
 *         description: Problem communicating with db
 */
expressHandler.delete('/post/:id', function (requestObject, responseObject){
    console.log(requestObject.params.id)
    dbHandler.run('delete from users where userID = ?', [requestObject.params.id], (deleteError)=>{
        resultObject = {'error': "", 'data': ""}
        if (deleteError){
            resultObject.error = deleteError
            resultObject.data = ""
        }
        else{
            resultObject.data = 'Record has been deleted Successfully '
        }
    })
})


// Activate / Deactivate user
/**
 * @swagger
 * /users/{id}:
 *  patch:
 *     name: Activate/ Deactivate User
 *     summary: Activate/ Deactivate User
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             userID:
 *               type: integer
 *             userActive:
 *               type: integer
 *         required:
 *           - userID
 *           - userActive
 *     responses:
 *       '200':
 *         description: User Activated/Deactivated in db
 *       '404':
 *         description: No user in db with that name
 *       '500':
 *         description: Problem communicating with db
 */
expressHandler.patch('/post/:id', function (requestObject, responseObject){
    console.log(requestObject.body)
    dbHandler.run('update users set userActive = ? where userID = ?',
        [requestObject.body.status, requestObject.body.id], (updateError)=>{
            resultObject = {'error': "", 'data': ""}
            if (updateError){
                resultObject.error = updateError
                resultObject.data = ""
            }
            else{
                resultObject.data = 'Record has been updated Successfully '
            }
        })
})


// Updating user Profile
/**
 * @swagger
 * /users/{id}:
 *  put:
 *     name: Update user profile
 *     summary: Update User Profile
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             userID:
 *               type: integer
 *             userFullName:
 *               type: string
 *             userEmail:
 *               type: string
 *             userActive:
 *               type: integer
 *         required:
 *           - userFullName
 *           - userID
 *           - userEmail
 *           - userActive
 *     responses:
 *       '200':
 *         description: User prfile has been updated in db
 *       '404':
 *         description: No user in db with that name
 *       '500':
 *         description: Problem communicating with db
 */
expressHandler.put('/post/:id', function (requestObject, responseObject){
    console.log(requestObject.body)
    dbHandler.run('update users set userFullName = ?, userEmail = ? where userID = ?',
        [
            requestObject.body.userFullName,
            requestObject.body.userEmail,
            requestObject.body.id
        ], (updateError)=>{
            resultObject = {'error': "", 'data': ""}
            if (updateError){
                resultObject.error = updateError
                resultObject.data = ""
            }
            else{
                resultObject.data = 'Record has been updated Successfully '
            }
        })
})

// Adding new User
/**
 * @swagger
 * /users:
 *  post:
 *     name: Adding new User
 *     summary: Adding New User
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             userFullName:
 *               type: string
 *             userEmail:
 *               type: string
 *             userActive:
 *               type: integer
 *         required:
 *           - userFullName
 *           - userEmail
 *           - userActive
 *     responses:
 *       '200':
 *         description: User has been added to db
 *       '404':
 *         description: No user in db with that name
 *       '500':
 *         description: Problem communicating with db
 */
expressHandler.post('/post', function (requestObject, responseObject){
    console.log(requestObject.body)
    dbHandler.run('INSERT INTO users (userFullName, userEmail, userActive) VALUES (?,?,?)',
        [
            requestObject.body.userFullName,
            requestObject.body.userEmail,
            requestObject.body.userActive
        ],
        (insertError)=>{
            resultObject = {'error': "", 'data': ""}
            if (insertError){
                resultObject.error = insertError
                resultObject.data = ""
            }
            else{
                resultObject.data = 'Record has been inserted Successfully '
            }
        })
});
expressHandler.listen(5000)