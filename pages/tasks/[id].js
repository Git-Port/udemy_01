import Link from 'next/link'
import useSWR from 'swr'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import { getAllTaskIds, getTaskData } from '../../lib/tasks'

// fetcher()を外部化するとなぜか dev でエラー, startでリアルタイム性が失われる。
// import {fetcher} from '../../lib/utils';
const fetcher = (url) => fetch(url).
  then((res) => res.json()).then((data) => data.results)

import Layout from '../../components/Layout'

export default function Task ({ id, staticTask }) {

  const router = useRouter()

  const { data: task, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/detail-task/${id}/`, fetcher, {
      fallbackData: staticTask,
    })

  useEffect(() => {
    mutate()
  }, [])

  if (router.isFallback) {
    return (<Layout title="Loading">Loading</Layout>)
  }

  if (!id) {
    return (<Layout title="404 Not Found.">
      <p>404 Not Found.</p>
    </Layout>)
  }

  return (<Layout title={task.title}>

    <p className={task.title}>
      {'ID: '}
      {task.id}
    </p>

    <p className="mb-4 text-xl font-bold">{task.title}</p>
    <p className="mb-12">{task.created_at}</p>

    <Link href={'/task-page'}>
      <div className="flex cursor-pointer mt-12">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3"
             viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd"
                d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"/>
        </svg>
        <span>Back to Task Page.</span>
      </div>
    </Link>

  </Layout>)

}

export const getStaticPaths = async () => {
  const paths = await getAllTaskIds()

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async ({ params }) => {
  const staticTask = await getTaskData(params.id)
  return {
    props: {
      id: staticTask.id,
      staticTask,
    },
    revalidate: 1,
  }
}
