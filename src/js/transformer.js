console.log(tf.version.tfjs)
tf.ENV.set('WEBGL_PACK', false);  // This needs to be done otherwise things run very slow v1.0.4
//
//

let styleImgSelector = document.getElementById('select-style-img')
console.log(styleImgSelector.value)
styleImgSelector.onchange = () => setStyleImg()



function setStyleImg() {
  console.log(this.styleImgSelector.value)
}



