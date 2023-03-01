# Readme

### Work-5 

### 功能主题——图片风格迁移

#### 贺思嘉 181250044

### 1. 安装与启动

- npm i 安装 package.json dependencies里的库（提交项目里**不包括node_modules文件夹**）
- 启动mongodb，建立对应数据库hw5，启动mongoose服务
- sudo npm i -g nodemon
- 终端输⼊nodemon server.js启动服务端
- 进入登陆页面后可进行注册登陆并访问主页

### 2. 实现

本项目选择图片风格迁移功能作为主题，通过**Tensorflow.Js**实现功能，在图片详情页面添加了风格迁移实现工具，项目提供了部分风格图片供用户选择，也支持用户上传自己的图片对网页内的图片进行风格迁移操作

- 引入tensorflow.js

  ```html
  <head>
    <meta charset="UTF-8">
    <title>DEMO</title>
    <link rel="stylesheet" href="../styles/demo_style.css">
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js"></script>
  </head>
  ```

  

- transformer.js

  - 考虑到结合已有项目添加智能化功能，网页需要较快的加载与响应速度，本项目选择了使用较小的模型实现风格迁移

    - 模型文件

      <img src="https://raw.githubusercontent.com/RusticMobius/MyPicGo/main/%E6%88%AA%E5%B1%8F2023-01-05%2022.29.45.png" alt="截屏2023-01-05 22.29.45" style="zoom:50%;" />

    - 模型加载

      ```javascript
      async function loadMobileNetStyleModel() {
      
        let mobileStyleNet = await tf.loadGraphModel(
          '../model/saved_model_style_js/model.json'
        );
        console.log('loading model')
        return mobileStyleNet;
      }
      
      async function loadSeparableTransformerModel() {
      
        this.originalTransformNet = await tf.loadGraphModel(
          '../model/saved_model_transformer_separable_js/model.json'
        );
      
        return this.originalTransformNet;
      }
      ```

    
    
  - 风格迁移
  
    ```js
    async function startStyling() {
      await tf.nextFrame();
      stylizeButton.value = 'Generating 100D representation';
      await tf.nextFrame();
      let bottleneck = await tf.tidy(() => {
        return styleModel.predict(tf.browser.fromPixels(sImg).toFloat().div(tf.scalar(255)).expandDims());
      })
      stylizeButton.value = 'Stylizing image...';
      await tf.nextFrame();
      const stylized = await tf.tidy(() => {
        return transformModel.predict([tf.browser.fromPixels(cImg).toFloat().div(tf.scalar(255)).expandDims(), bottleneck]).squeeze();
      })
      await tf.browser.toPixels(stylized, canvas);
      bottleneck.dispose();  // Might wanna keep this around
      stylized.dispose();
    }
    ```
  
    
  

### 3. 界面截图

文档内仅展示风格迁移相关界面，其他界面相较上一次作业未做改动

- 主页 gallery.html

  <img src="https://raw.githubusercontent.com/RusticMobius/MyPicGo/main/%E6%88%AA%E5%B1%8F2023-01-05%2022.38.37.png" alt="截屏2023-01-05 22.38.37" style="zoom:50%;" />

  

- 详情页 demo.html

  - 页面

    <img src="https://raw.githubusercontent.com/RusticMobius/MyPicGo/main/%E6%88%AA%E5%B1%8F2023-01-05%2022.39.45.png" alt="截屏2023-01-05 22.39.45" style="zoom:50%;" />

    

  - 项目提供的可选风格图片示例

    <img src="https://raw.githubusercontent.com/RusticMobius/MyPicGo/main/%E6%88%AA%E5%B1%8F2023-01-05%2022.40.25.png" alt="截屏2023-01-05 22.40.25" style="zoom: 50%;" />

    

    <img src="/Users/scarlett/Desktop/截屏2023-01-05 22.41.53.png" alt="截屏2023-01-05 22.41.53" style="zoom: 50%;" />
  
    
  
    <img src="https://raw.githubusercontent.com/RusticMobius/MyPicGo/main/%E6%88%AA%E5%B1%8F2023-01-05%2022.42.06.png" alt="截屏2023-01-05 22.42.06" style="zoom: 50%;" />
  
  - 上传风格图片
  
    <img src="https://raw.githubusercontent.com/RusticMobius/MyPicGo/main/%E6%88%AA%E5%B1%8F2023-01-05%2022.43.29.png" alt="截屏2023-01-05 22.43.29" style="zoom:50%;" />
  
     
  
    <img src="https://raw.githubusercontent.com/RusticMobius/MyPicGo/main/%E6%88%AA%E5%B1%8F2023-01-05%2022.43.41.png" alt="截屏2023-01-05 22.43.41" style="zoom:67%;" />
  
  - 风格迁移
  
    <img src="https://raw.githubusercontent.com/RusticMobius/MyPicGo/main/%E6%88%AA%E5%B1%8F2023-01-05%2022.45.24.png" alt="截屏2023-01-05 22.45.24" style="zoom:50%;" />
  
    
  
    
  
    <img src="https://raw.githubusercontent.com/RusticMobius/MyPicGo/main/%E6%88%AA%E5%B1%8F2023-01-05%2022.46.52.png" alt="截屏2023-01-05 22.46.52" style="zoom:50%;" />
  
    
  
    
  
    <img src="https://raw.githubusercontent.com/RusticMobius/MyPicGo/main/%E6%88%AA%E5%B1%8F2023-01-05%2022.47.57.png" alt="截屏2023-01-05 22.47.57" style="zoom:50%;" />	
  
    

### 4. 参考

- https://codelabs.developers.google.com/codelabs/tensorflowjs-teachablemachine-codelab/index.html?hl=zh-cn#0
- https://www.tensorflow.org/js/tutorials?hl=zh-cn
- https://github.com/reiinakano/arbitrary-image-stylization-tfjs