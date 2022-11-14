import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteTodo, getTodoById } from '../../helpers/todosAcess'

// import { deleteTodo } from '../../businessLogic/todos'
// import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const todo = await getTodoById(todoId)
    // console.log(todoId)
    // TODO: Remove a TODO item by id
    const d = await deleteTodo(todo)
 
    return  {
      statusCode: 201,
      body: JSON.stringify({
        items: d
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
