<template>
  <el-dialog
    title="人事智能助手"
    v-model="dialogVisible"
    width="500px"
    :close-on-click-modal="false"
  >
    <!-- 1. 给聊天容器添加 ref 属性，用于获取DOM元素 -->
    <div class="chat-container" ref="chatContainer">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message', msg.role]"
      >
        <div class="message-content">{{ msg.content }}</div>
      </div>
    </div>
    <div class="input-container">
      <el-input
        v-model="userInput"
        placeholder="请输入你的问题，如：技术岗位有多少个？营销岗位编制人数总和是多少？"
        @keyup.enter="sendMessage"
        :disabled="isLoading" 
      ></el-input>
      <el-button 
        type="primary" 
        @click="sendMessage"
        :loading="isLoading"  
      >
        发送
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'HrAgentChat',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    employeeId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: this.visible,
      userInput: '',
      messages: [
        { role: 'assistant', content: '你好，我是人事智能助手，可查询岗位数量、编制人数统计等信息～' }
      ],
      isLoading: false  // 新增：加载状态标识
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit('update:visible', val);
    }
  },
  methods: {
    async sendMessage() {
      // 1. 校验：空内容/加载中时不发送
      if (!this.userInput.trim() || this.isLoading) return;

      const userMsg = this.userInput.trim();
      this.messages.push({ role: 'user', content: userMsg });
      this.userInput = '';
      this.isLoading = true;  // 开启加载状态

      try {
        const res = await this.$axios.post('/api/hr/agent/query', {
          user_query: userMsg,
          employee_id: this.employeeId
        });

        if (res.data.success) {
          this.messages.push({ role: 'assistant', content: res.data.answer });
        } else {
          this.messages.push({ role: 'assistant', content: '抱歉，查询失败了。' });
        }
      } catch (error) {
        this.messages.push({ role: 'assistant', content: '网络异常，请检查Agent服务是否启动～' });
      } finally {
        this.isLoading = false;  // 关闭加载状态
        // 2. 关键：DOM更新后自动滚动到底部
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },
    // 新增：滚动到底部的方法
    scrollToBottom() {
      const container = this.$refs.chatContainer;
      if (container) {
        // 设置滚动条到容器最底部
        container.scrollTop = container.scrollHeight;
      }
    }
  }
}
</script>

<style scoped>
.chat-container {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 16px;
}
.message {
  margin-bottom: 12px;
  display: flex;
}
.message.user {
  justify-content: flex-end;
}
.message.assistant {
  justify-content: flex-start;
}
.message-content {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #f0f0f0;
}
.message.user .message-content {
  background-color: #409eff;
  color: white;
}
.input-container {
  display: flex;
  gap: 8px;
}
.el-input {
  flex: 1;
}
</style>