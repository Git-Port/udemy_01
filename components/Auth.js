import {LockClosedIcon} from '@heroicons/react/solid';
import {useState} from 'react';
import {useRouter} from 'next/router';
import Cookie from 'universal-cookie';

const cookie = new Cookie();

export default function Auth() {

  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const login = async () => {

    try {

      await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/auth/jwt/create/`,
          {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: username, password: password}),
          }).then((res) => {
        if (res.status === 400) {
          throw 'authentication failed';
        } else if (res.ok) {
          return res.json();
        }
      }).then((data) => {
        const options = {path: '/'}; // 「/」ルート以下でcookieが使用可能
        cookie.set('access_token', data.access, options);
      });
      router.push('/main-page');

    } catch (err) {
      alert(err); // 400エラーが出たらアラート
    }

  };

  const authUser = async (e) => {

    // submitボタン押下時のブラウザリロード防止
    e.preventDefault();

    if (isLogin) {
      login();
    } else {
      try {

        await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/api/register/`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username: username, password: password}),
        }).then((res) => {
          if (res.status === 400) {
            throw 'authentication failed';
          }
        });

        login();

      } catch (err) {
        alert(err);
      }
    }

  };

  return (<div
      className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
    <div className="max-w-md w-full space-y-8">
      <div>
        <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isLogin ? 'Login' : 'Sign up'}
        </h2>
      </div>
      <form className="mt-8 space-y-6" method="POST" onSubmit={authUser}>
        <input type="hidden" name="remember" defaultValue="true"/>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="username"
                value={username}
                onChange={(e) => { // 入力する度に値を渡す
                  setUsername(e.target.value);
                }}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => { // 入力する度に値を渡す
                  setPassword(e.target.value);
                }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me"
                   className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#"
               className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
                <span
                    className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                      className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                      aria-hidden="true"/>
                </span>
            {isLogin ? 'Login' : 'Sign up'}
          </button>
        </div>

        <div className="flex items-center justify-center">
          <div className="text-sm">
            <span
                onClick={() => setIsLogin(!isLogin)}
                className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500">
              Change Mode
            </span>
          </div>
        </div>

      </form>
    </div>
  </div>);
}
