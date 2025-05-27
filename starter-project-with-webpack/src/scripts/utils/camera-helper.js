let width =320;
let height = 0;
let streaming = false; //menandakan apakah streaming sudah dimulai atau belum
let currentStream;

async function startup() {
  //menangkap element kamera
  const cameraVideo = document.getElementById('camera-video'); //pada index,html element video
  const cameraCanvas = document.getElementById('camera-canvas'); //pada index.html element canvas
  const cameraTakeButton = document.getElementById('camera-take-button'); //pada index.html element button
  const cameraListSelect = document.getElementById('camera-list-select'); //pada index.html element select

  //Proses penghitungan height kita lakukan dalam event “canplay”
  cameraVideo.addEventListener('canplay', () => {
    if(streaming){
      return;
    }
    //menentukan tinggi dinamis
    height = (cameraVideo.videoHeight*width) / cameraVideo.videoWidth; //menghitung tinggi canvas berdasarkan lebar video

    cameraVideo.setAttribute('width', width.toString()); // mengatur lebar video
    cameraVideo.setAttribute('height', height.toString()); // mengatur tinggi video
    cameraCanvas.setAttribute('width', width.toString()); // mengatur lebar canvas
    cameraCanvas.setAttribute('height', height.toString()); // mengatur tinggi canvas
    streaming = true; //menandakan bahwa streaming sudah dimulai
  //menangkap gambar
  });
//menghasilkan gambar yang diambil dari kamera
function populateTakenPicture(image) {
  const photoPreview = document.getElementById('photoPreview');
  if (photoPreview) {
    photoPreview.src = image;
    photoPreview.width = 320;   // Ganti sesuai ukuran yang diinginkan
    photoPreview.height = 240  // Ganti sesuai ukuran yang diinginkan
    photoPreview.classList.remove('d-none');
  }
}

  async function getStream(usingRear) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Perangkat Anda tidak mendukung kamera atau akses kamera diblokir.');
      throw new Error('getUserMedia is not supported');
  }
    // fungsi yang bertugas untuk membuat kamera
    //method MediaDevices.getUserMedia untuk menciptakan sebuah objek yang bernama MediaStream
   try{
      return await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: usingRear ? 'environment' : 'user' //menerapkan permintaan kamera depan atau belakang auto dari user yaitu depan
        },//bisa tambahkan yang lain seperti audio
        deviceId: {
          exact: !streaming ? undefined : cameraListSelect.value,
        },
        aspectRatio: 16 / 9, //mengatur rasio aspek video
        //mengatur resolusi video
        //bisa diubah sesuai kebutuhan
        width: 1280,
        height: 720,
        
      });
    }catch(error){
      throw error;
    }
  }
  //fungsi untuk menampilkan pilihan kamera yang tersedia
  async function populateCameraList() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    alert('Perangkat Anda tidak mendukung kamera atau akses kamera diblokir.');
    return;
  }
    try{
      const enumerateDevices = await navigator.mediaDevices.enumerateDevices(); //mengambil daftar perangkat media yang tersedia
      const videoDevices = enumerateDevices.filter(device => device.kind === 'videoinput'); //memfilter perangkat yang hanya berjenis video input
      cameraListSelect.innerHTML = videoDevices.reduce((accumulator, device ,currentIndex)=>{
        return accumulator.concat(`
          <option value="
          ${device.deviceId}">${device.label || `Camera ${currentIndex + 1}`}
          </option>
          `);
        },""); //mengisi select dengan daftar perangkat video input
      
    }catch(error) {
      throw error; //jika terjadi error, lemparkan error
  }
}

  function cameraLaunch(stream) {
    //menayangkan object stream ini kepada user
    cameraVideo.srcObject = stream;
    cameraVideo.play();
  }

  //Penangkapan gambar akan memanfaatkan Canvas API sehingga kita memiliki <canvas> dalam index.html yang berfungsi menangkap gambar dan menampilkannya dalam bentuk img
  function cameraTakePicture() {
    const context = cameraCanvas.getContext('2d'); //mengambil context dari canvas dan menyimpanb sebuah objek bernama CanvasRenderingContext2D.
    cameraCanvas.width = cameraVideo.videoWidth; //mengatur lebar canvas sesuai dengan lebar video
    cameraCanvas.height = cameraVideo.videoHeight; //mengatur tinggi canvas sesuai dengan tinggi video
    context.drawImage(cameraVideo ,0, 0, cameraVideo.videoWidth, cameraVideo.videoHeight); //menggambar gambar dari video ke canvas

    return cameraCanvas.toDataURL('image/png'); //mengembalikan data gambar dalam format PNG
  }

  //menerapkan kamera list ketika di ubah
    cameraListSelect.addEventListener('change', async (event) => {
    stopCurrentStream(); //menghentikan stream kamera sebelumnya
    console.log('Kamera:', event.target.value);
    const stream = await getStream(); //dengan membuat stream baru
    currentStream = stream; //menyimpan stream baru ke currentStream
    cameraLaunch(currentStream); //menampilkan kamera baru
  });

  cameraTakeButton.addEventListener('click', () => {
    const imageUrl = cameraTakePicture();
    populateTakenPicture(imageUrl);
    cameraCanvas.classList.add('d-none'); // Sembunyikan canvas setelah ambil gambar
  });
  
  async function init() {
    //memanggil getStream untuk mendapatkan stream kamera
   try{
    await populateCameraList(); //mengisi daftar kamera yang tersedia
    const stream = await getStream();
    cameraLaunch(stream); //menayangkan stream ke video
    currentStream = stream; //menyimpan stream ke currentStream
    console.log(stream);
    currentStream.getVideoTracks().forEach((track) => { //melihat penetapan rasio
      console.log(track.getSettings());
    });
   } catch (error) {
    console.error(error);
    alert('Error occurred:',error.message);
   }
  }

  init();
}

function stopCurrentStream() {
  if (currentStream && typeof currentStream.getTracks === 'function') {
    currentStream.getTracks().forEach(track => track.stop());
    currentStream = null;
  }
  // Sembunyikan elemen kamera
  const cameraVideo = document.getElementById('camera-video');
  const cameraCanvas = document.getElementById('camera-canvas');
  if (cameraVideo) {
    cameraVideo.pause();
    cameraVideo.srcObject = null; // <--- ini penting!
    cameraVideo.classList.add('d-none');
  }
  if(cameraCanvas){
    cameraCanvas.classList.add('d-none');
  }
}

export { startup, stopCurrentStream };
