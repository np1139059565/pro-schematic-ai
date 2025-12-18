let API_URL='https://113.46.209.138:5000/call-cursor-cli';


// 自定义AI接口
async function callCursorCLI(trimmedHistory) {
	try {
		console.info(trimmedHistory,11111111111111111111);
		//如果是第一次请求，要清空上次的sessionid
		if(trimmedHistory.length==2){
			window.top.session_id=null;
		}
		//是否通过sessionid恢复会话,恢复的会话不需要带历史记录
		const prompts=JSON.parse(JSON.stringify(trimmedHistory)).splice((window.top.session_id!=null?trimmedHistory.length-1:0),999);
		// 发送 POST 请求到 ARK API
		const response = await fetch(API_URL, {
			method: 'POST', // 使用 POST 方法
			headers: {
				'Content-Type': 'application/json', // 设置内容类型为 JSON
				Authorization: `Bearer ${apiKey}`, // 设置授权头
			},
			body: JSON.stringify({
				// 请求体
				sessionid:window.top.session_id,
				prompt: prompts.map(p=>`${p.role}:${p.content}`.trim()).join('\n'), // 包含对话历史的消息数组
			}),
		});

		// 检查响应状态
		if (!response.ok) {
			// 如果响应不成功
			const errorText = await response.text(); // 获取错误文本
			throw new Error(`HTTP 错误! 状态码: ${response.status}\n${errorText}`); // 抛出错误
		}

		// 解析响应数据
		const result = await response.json(); // 解析 JSON 响应
		//存储会话sessionid
		window.top.session_id=result.session_id;
		console.log('AI 请求成功:', result); // 输出成功日志
		return result; // 返回结果
	} catch (error) {
		// 捕获网络错误或其他错误
		console.error('AI 请求失败:', error); // 输出错误日志
		throw error; // 向上抛出错误
	}
}

window.CursorCLI={
    callCursorCLI,
    API_URL,
};