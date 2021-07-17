import { Icon } from '@iconify/react';
import { Divider } from 'antd';
import { loginWithEmail, t, useAsyncFn } from 'pawchat-shared';
import React, { useCallback, useState } from 'react';
import { Spinner } from '../../components/Spinner';
import { string } from 'yup';
import { useHistory } from 'react-router';
import { setUserJWT } from '../../utils/jwt-helper';
import { setGlobalUserLoginInfo } from '../../utils/user-helper';

/**
 * TODO:
 * 第三方登录
 */
const OAuthLoginView: React.FC = React.memo(() => {
  return (
    <>
      <Divider>或</Divider>

      <div className="bg-gray-400 w-1/3 px-4 py-1 text-3xl text-center rounded-md cursor-pointer shadow-md">
        <Icon className="mx-auto" icon="mdi-github" />
      </div>
    </>
  );
});
OAuthLoginView.displayName = 'OAuthLoginView';

/**
 * 登录视图
 */
export const LoginView: React.FC = React.memo(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const [{ loading, error }, handleLogin] = useAsyncFn(async () => {
    await string()
      .email('邮箱格式不正确')
      .required('邮箱不能为空')
      .validate(email);

    await string()
      .min(6, '密码不能低于6位')
      .required('密码不能为空')
      .validate(password);

    const data = await loginWithEmail(email, password);

    setGlobalUserLoginInfo(data);
    await setUserJWT(data.token);
    history.push('/main');
  }, [email, password, history]);

  const toRegisterView = useCallback(() => {
    history.push('/entry/register');
  }, [history]);

  return (
    <div className="w-96 text-white">
      <div className="mb-4 text-2xl">登录 Paw Chat</div>

      <div>
        <div className="mb-4">
          <div className="mb-2">{t('邮箱')}</div>
          <input
            name="login-email"
            className="appearance-none rounded-md relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-base sm:text-sm"
            placeholder="name@example.com"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <div className="mb-2">密码</div>
          <input
            name="login-password"
            className="appearance-none rounded-md relative block w-full px-4 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-base sm:text-sm"
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error.message}</p>}

        <button
          className="w-full py-2 px-4 mb-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          disabled={loading}
          onClick={handleLogin}
        >
          {loading && <Spinner />}
          登录
        </button>

        <button
          className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none disabled:opacity-50"
          disabled={loading}
          onClick={toRegisterView}
        >
          注册账号
          <Icon icon="mdi-arrow-right" className="ml-1 inline" />
        </button>
      </div>
    </div>
  );
});
LoginView.displayName = 'LoginView';