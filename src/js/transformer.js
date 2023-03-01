console.log(tf.version.tfjs)
tf.ENV.set('WEBGL_PACK', false);  // This needs to be done otherwise things run very slow v1.0.4
//
//
let guideline = document.getElementById('guideline')
let sImg = document.getElementById('sImg')
let cImg = document.getElementById('cImg')
let canvas = document.getElementById('styleCanvas')
let styleImgSelector = document.getElementById('select-style-img')
let fileSelector = document.getElementById('file')
let stylizeButton = document.getElementById("stylize")
let styleModel
let transformModel
console.log(styleImgSelector.value)
styleImgSelector.onchange = () => setStyleImg()
fileSelector.onchange = () => selectLocalImg()

stylizeButton.onclick = () => {
  disableStylizeButton()
  if(guideline.style.display !== 'none'){
    startStyling().finally( () => {
      enableStylizeButton()
      guideline.style.display = 'none'
    })
  }else{
    console.log('click me!')
    startStyling().finally( () => {
      enableStylizeButton()
    })
  }
}
function selectLocalImg() {
  styleImgSelector.value = "local"
  let opt = document.getElementById('local-style-img-opt')
  opt.innerText = fileSelector.files[0].name
  let imgFile = fileSelector.files[0]
  let imgUrl = URL.createObjectURL(imgFile)
  sImg.setAttribute("src",imgUrl)
}
function setStyleImg() {
  console.log(styleImgSelector.value)
  if(styleImgSelector.value === 'file'){
    fileSelector.click()
  }else{
    let imgUrl = '../res/style_images/' + styleImgSelector.value + '.jpg'
    sImg.setAttribute("src",imgUrl)
  }
}


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

Promise.all([
  loadMobileNetStyleModel(),
  loadSeparableTransformerModel(),
]).then(([styleNet, transformNet]) => {
  console.log('Loaded styleNet');
  styleModel = styleNet;
  transformModel = transformNet;
  enableStylizeButton()
})

function enableStylizeButton() {
  // stylizeButton.disabled = 'false'
  stylizeButton.removeAttribute('disabled')
  stylizeButton.value = 'Stylize'
}

function disableStylizeButton() {
  stylizeButton.disabled = 'true'
  stylizeButton.value = 'Stylizing...'
}

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
