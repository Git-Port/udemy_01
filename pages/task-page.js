import Link from "next/link"
import useSWR from "swr"
import { useEffect } from "react"
import { getAllTasksData } from "../lib/tasks"
import Task from "../components/Task"
import Layout from "../components/Layout"
import { fetcher } from "../lib/utils"

const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/list-task/`

export default function TaskPage({ staticFilteredTasks }) {
  const { data: tasks, mutate } = useSWR(apiUrl, fetcher, {
    fallbackData: staticFilteredTasks,
  })
  const filteredTasks = tasks?.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )
  useEffect(() => {
    mutate()
    console.log("実行!")
  }, [])

  return (
    <Layout title="Task Page">
      <ul>
        {filteredTasks &&
          filteredTasks.map((task) => (
            <Task key={task.id} task={task} taskDeleted={mutate} />
          ))}
      </ul>
      <Link href="/main-page">
        <div className="mt-12 flex cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Back to Main Page.</span>
        </div>
      </Link>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const staticFilteredTasks = await getAllTasksData()

  return {
    props: { staticFilteredTasks },
    revalidate: 1,
  }
}
