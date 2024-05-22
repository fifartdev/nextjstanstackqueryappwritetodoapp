'use client'
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Client, Databases, ID, Query } from 'appwrite';
import Link from "next/link";
import { useState } from "react";


const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT);

const db = new Databases(client)
const DATABASE = process.env.NEXT_PUBLIC_APPWRITE_DB
const COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION

export default function Home() {

  const [title,setTitle] = useState('')

const queryClient = useQueryClient()
  const getTodos = async () => {
    const res = await db.listDocuments(DATABASE,COLLECTION, [Query.orderAsc('status'), Query.orderDesc('$createdAt')])
    return res.documents
  }

  const newTodo = async (title)=>{
    const res = await db.createDocument(DATABASE,COLLECTION, ID.unique(), {title:title, status:false}); 
    return res
  }

  const deleteTodo = async (id)=>{
    const res = await db.deleteDocument(DATABASE,COLLECTION, id)
    return res
  }

  const updateTodo = async ({id, status})=>{
    const res = await db.updateDocument(DATABASE,COLLECTION,id,{status})
    return res
  }

  const query = useQuery({
    queryKey:['todos'],
    queryFn: getTodos
  })

  const createTodoMutation = useMutation({
    mutationFn: newTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      setTitle('')
    },
    onError: (error) => { 
      console.log('Error creating Document', error);
    }
  })

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (error) => { 
      console.log('Error Deleting Document', error);
    } 
  })

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (error) => { 
      console.log('Error Updating Document', error);
    } 
  })

  if(query.isLoading){
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex justify-center items-center h-12">
      <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
    </div>
      </div>
    )
  }

  if(query.error){
    window.alert('ERROR')
  }

  return (
    <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="bg-blue-600 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Todo App</h1>
                    <nav>
                        <Link href="/" className="text-white hover:text-blue-200 px-3 active:text-white">Home</Link>
                        <Link href="/about" className="text-white hover:text-blue-200 px-3 active:text-white">About</Link>
                    </nav>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow container mx-auto p-6">
                <div className="flex flex-col justify-center items-center">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            createTodoMutation.mutate(title);
                        }}
                        className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
                    >
                        <input
                            type="text"
                            value={title}
                            placeholder="Input Text"
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="border-2 rounded-md border-gray-400 w-full p-2 mb-4"
                        />
                        <button
                            className="bg-blue-600 hover:bg-blue-400 w-full p-2 rounded-md text-white"
                            type="submit"
                        >
                            New Todo
                        </button>
                    </form>
                </div>

                <div className="mt-8">
                    <hr />
                    <div className="flex justify-center mt-4">
                        {query.isFetching ? 
                        
                        <ul className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      {[...Array(5)].map((_, index) => (
        <li key={index} className="border-b py-2 flex justify-between items-center animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        </li>
      ))}
    </ul>
                       : 
                       <ul className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                        {query.data.length === 0 ? <li className="border-b py-2 flex justify-between items-center animate-pulse">No Tasks</li> : 

                       query.data?.map((todo) => {
                           return (
                             <li key={todo.$id} className="border-b py-2 flex justify-between items-center flex-1">
                             <span className={`${todo.status ? 'line-through text-gray-500' : ''}`}>
                              {todo.title}
                            </span>
                             {/* <button
                                            className="bg-green-600 text-white hover:bg-green-80 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                                            onClick={() => updateTodoMutation.mutate({id: todo.$id, status: todo.status === false ? true : false})}
                                        >E</button> */}
                            <div className="justify-between items-end"> 
                            <button
                              className={`p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 ${
                                todo.status ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}
                                onClick={() => updateTodoMutation.mutate({id: todo.$id, status: !todo.status})}
                                >
                              {todo.status ? 'Done' : 'Pending'}
                            </button>
                             <button 
                                 className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 mx-2"
                                 onClick={()=>deleteTodoMutation.mutate(todo.$id)}
                             >
                                 X
                             </button>
                            </div>            
                         </li> 
                         
                           );
                       })}
                   </ul>
                      }


                       
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white p-4">
                <div className="container mx-auto text-center">
                    <p>&copy; 2024 Todo App. All rights reserved.</p>
                </div>
            </footer>
        </div>
  );
}
