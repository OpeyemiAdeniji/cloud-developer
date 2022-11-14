import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

// import { updateTodo } from '../../businessLogic/todos'
import { todoUpdate } from '../../helpers/todos'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
// import { getUserId } from '../utils'
import { userTodoUpdate } from '../../helpers/todosAcess'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    console.log(updatedTodo)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const todo = todoUpdate(updatedTodo, event)
    const uTodo = await userTodoUpdate(todo)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uTodo
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
