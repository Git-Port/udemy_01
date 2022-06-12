import Link from 'next/link'
import useSWR from 'swr'
import { useEffect } from 'react'

import StateContextProvider from '../context/StateContext'

import { getAllTasksData } from '../lib/tasks'

import Task from '../components/Task'
import Layout from '../components/Layout'
import TaskForm from '../components/TaskForm'

import { fetcher } from '../lib/utils'

const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/list-task/`

export default function TaskPage ({ staticFilteredTasks }) {

  // 第1引数: エンドポイント, 第2引数: エンドポイントから取得したデータ(新しいデータ), 第3引数: ビルド時に取得したデータ(古いデータ)
  // 取得したデータはは tasks に格納される
  // 最初は第3引数の staticFilteredTasks が tasks に格納される / fallbackData と tasks が繋がっているとも考えられる
  // 初期データ(fallbackData)を表示させつつ、同時にクライアント再度からAPIにデータを取得する
  // 最新データを取得したら、古いデータを上書きする形で表示される
  const { data: tasks, mutate } = useSWR(apiUrl, fetcher, {
    fallbackData: staticFilteredTasks,
  })

  const filteredTasks = tasks?.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  )

  // マウントされた際に確実にキャッシュが更新されるように useEffect を利用する
  // マウントされたら１回だけ実行される
  useEffect(() => {
    mutate()
  }, [])

  return (<StateContextProvider>
    {/* <StateContextProvider>で囲われた要素は、プロバイダーのchildrenに渡される */}
    {/* <StateContextProvider>で囲われた要素は、プロバイダーのuseContextを使用できる */}
    <Layout title="Task Page">
      <TaskForm taskCreated={mutate}/>

      <ul>
        {filteredTasks &&
          filteredTasks.map((task) => <Task key={task.id} task={task}
                                            taskDeleted={mutate}/>)}
      </ul>

      <Link href="/main-page">
        <div className="flex cursor-pointer mt-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
               viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd"
                  d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"/>
          </svg>
          <span>Back to Main Page.</span>
        </div>
      </Link>

    </Layout>
  </StateContextProvider>)
}

export const getStaticProps = async () => {

  const staticFilteredTasks = await getAllTasksData()

  return {
    props: { staticFilteredTasks }, revalidate: 1,
  }
}
