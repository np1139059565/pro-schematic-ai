


// 私服配置
let PRIVATE_SERVER_URL = 'https://113.46.209.138'; // 私服地址


/**
 * 获取私服地址
 * @returns {string} 私服地址
 */
function getPrivateServerUrl() {
	try {
		// 从 localStorage 读取私服地址配置
		const savedServerUrl = localStorage.getItem('private_server_url');
		if (savedServerUrl) {
			return savedServerUrl; // 返回保存的私服地址
		}
	} catch (error) {
		console.error('读取私服地址配置失败:', error); // 输出错误日志
	}
	return PRIVATE_SERVER_URL; // 返回默认私服地址
}

/**
 * 获取用户API Key（从localStorage读取）
 * 用户API Key用于在私服中认证身份和记录token使用
 * @returns {string|null} 用户API Key
 */
function getUserApiKey() {
	try {
		// 从 localStorage 读取用户API Key
		const userApiKey = localStorage.getItem('user_api_key'); // 读取用户API Key
		return userApiKey || null; // 返回用户API Key，如果不存在则返回null
	} catch (error) {
		console.error('读取用户API Key失败:', error); // 输出错误日志
		return null; // 返回null
	}
}




async function callArkChat(mhistory, previousResponseId = null, tools = []) {
	try {
		// 获取用户API Key（用于在私服中认证身份和记录token使用）
		const userApiKey = getUserApiKey();
		if (!userApiKey) {
			throw new Error('用户API Key不能为空,请点击上方按钮进行配置后使用');
		}

		const requestBody = {
			'user_api_key': userApiKey, // 用户API Key（必选）
			input: [mhistory[mhistory.length - 1]], // 最后一条消息（必选）
		};

		// 如果有上一轮响应ID，添加到请求体中
		if (previousResponseId) {
			requestBody.previous_response_id = previousResponseId; // 添加上一轮响应ID
		} else if (mhistory.length === 2) {
			// 如果无上一轮响应ID,则将消息历史作为输入
			requestBody.input = mhistory;
		}

		// 如果有工具，则添加到请求体中(转换MCP工具为ARK格式)
		if (tools && tools.length > 0) {
			requestBody.tools = tools.map(tool => ({
				type: 'function',
				name: tool.name,
				description: tool.description,
				parameters: tool.inputSchema,
			})); // 添加工具数组
		}

		// 发送 POST 请求到私服端点（私服会转发到ARK API并记录token使用）
		const response = await fetch(`${getPrivateServerUrl()}/api/ark-chat`, {
			method: 'POST', // 使用 POST 方法
			headers: {
				'Content-Type': 'application/json', // 设置内容类型为 JSON
			},
			body: JSON.stringify(requestBody), // 请求体
		});

		// 检查响应状态
		if (!response.ok) {
			// 如果响应不成功
			const errorText = await response.text(); // 获取错误文本
			let errorMessage = `HTTP 错误! 状态码: ${response.status}`;
			try {
				const errorJson = JSON.parse(errorText);
				errorMessage = errorJson.error || errorMessage;
			} catch (e) {
				errorMessage += `\n${errorText}`;
			}
			throw new Error(errorMessage); // 抛出错误
		}

		// 解析响应数据
		const result = await response.json(); // 解析 JSON 响应
		console.log('AI 请求成功:', result); // 输出成功日志
		return result; // 返回结果
	} catch (error) {
		// 捕获网络错误或其他错误
		console.error('AI 请求失败:', error); // 输出错误日志
		throw error; // 向上抛出错误
	}
}

/**
 * 更新 ARK API 配置
 * @param userApiKey - 用户API Key（从私服获取，用于认证和记录token使用）
 */
function updateConfig(userApiKey) {
	// 如果提供了用户API Key，保存到localStorage
	if (userApiKey) {
		try {
			localStorage.setItem('user_api_key', userApiKey); // 保存用户API Key
		} catch (error) {
			console.error('保存用户API Key失败:', error); // 输出错误日志
		}
	}

}

// 导出函数供其他模块使用
// 浏览器环境，挂载到全局对象
window.ArkAPI = {
	callArkChat,
	updateConfig,
	getPrivateServerUrl,
	getUserApiKey,
	PRIVATE_SERVER_URL,
};

