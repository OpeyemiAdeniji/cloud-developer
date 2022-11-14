import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')
const todosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX
// const todosTable = "serverless"
const docClient: DocumentClient = createDynamoDBClient()

// // TODO: Implement the dataLayer logic
export async function createTodo(todo: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: todosTable,
      Item: todo
    }).promise()

    return todo
  }

  export async function getAllTodosByUserId(userId: string): Promise<TodoItem[]> {
      const result = await docClient.query({
        TableName : todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()
    return result.Items as TodoItem[]
  }

  export async function getTodoById(todoId: string): Promise<TodoItem> {
    const result = await docClient.query({
      TableName : todosTable,
      IndexName: index,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
          ':todoId': todoId
      }
  }).promise()
  const items = result.Items

  if (items.length !== 0) return result.Items[0] as TodoItem
  return null
}

export async function updateTodo(todo: TodoItem): Promise<TodoItem> {
  const result = await docClient.update({
    TableName : todosTable,
    Key:{
      userId: todo.userId,
      todoId: todo.todoId
    },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
        ':attachmentUrl': todo.attachmentUrl
    }
}).promise()

return result.Attributes as TodoItem
}

export async function userTodoUpdate(todo: TodoItem): Promise<TodoItem> {
  const result = await docClient.update({
    TableName : todosTable,
    Key:{
      userId: todo.userId,
      todoId: todo.todoId
    },
    UpdateExpression: 'set name = :name, dueDate= :dueDate, done = :done',
    ExpressionAttributeValues: {
        ':name': todo.name,
        ':dueDate': todo.dueDate,
        ':done': todo.done
    }
}).promise()

return result.Attributes as TodoItem
}

// async updateToDo(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {
//   console.log("Updating todo");

//   const params = {
//       TableName: this.todoTable,
//       Key: {
//           "userId": userId,
//           "todoId": todoId
//       },
//       UpdateExpression: "set #a = :a, #b = :b, #c = :c",
//       ExpressionAttributeNames: {
//           "#a": "name",
//           "#b": "dueDate",
//           "#c": "done"
//       },
//       ExpressionAttributeValues: {
//           ":a": todoUpdate['name'],
//           ":b": todoUpdate['dueDate'],
//           ":c": todoUpdate['done']
//       },
//       ReturnValues: "ALL_NEW"
//   };

//   const result = await this.docClient.update(params).promise();
//   console.log(result);
//   const attributes = result.Attributes;

//   return attributes as TodoUpdate;
// }

export async function deleteTodo(todo: TodoItem): Promise<TodoItem> {
  const result = await docClient.delete({
    TableName : todosTable,
    Key:{
      userId: todo.userId,
      todoId: todo.todoId
    },
 
}).promise()
return result.Attributes as TodoItem
}

  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }
  