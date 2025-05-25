export default class AboutPage {
  async render() {
    return `
      <section class="about-section container my-5">
        <h1 class="section-title text-center mb-4">Tentang Jejak Cerita</h1>
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-10">
            <div class="card shadow-sm p-4 mb-4">
              <p class="lead text-center">Selamat datang di <strong>Jejak Cerita</strong>, platform di mana setiap petualangan menemukan rumahnya. Kami percaya bahwa setiap perjalanan, besar atau kecil, memiliki kisah unik yang layak untuk dibagikan.</p>
            </div>

            <h2 class="h3 mb-3 text-primary">Visi Kami</h2>
            <p>Menjadi komunitas global terkemuka untuk para penjelajah, penulis, dan siapa pun yang ingin mengabadikan serta berbagi momen berharga mereka di seluruh dunia.</p>

            <h2 class="h3 mb-3 text-primary">Misi Kami</h2>
            <ul class="list-unstyled">
              <li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i>Menyediakan alat yang intuitif dan mudah digunakan untuk merekam cerita Anda, lengkap dengan lokasi geografis dan foto yang memukau.</li>
              <li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i>Menciptakan ruang di mana pengguna dapat dengan mudah menemukan, menjelajahi, dan terinspirasi oleh kisah-kisah otentik dari berbagai sudut bumi.</li>
              <li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i>Membangun jembatan koneksi antar sesama penjelajah dan pecinta cerita.</li>
              <li class="mb-2"><i class="fas fa-check-circle text-success me-2"></i>Memastikan aksesibilitas bagi semua, sehingga setiap orang dapat berpartisipasi dan menikmati keindahan berbagi cerita.</li>
            </ul>

            <h2 class="h3 mb-3 text-primary">Bagaimana Jejak Cerita Bekerja?</h2>
            <p>Dengan Jejak Cerita, Anda dapat:</p>
            <div class="row g-3 mb-4">
              <div class="col-md-4">
                <div class="card h-100 shadow-sm text-center p-3">
                  <i class="fas fa-edit fa-3x text-primary mb-3"></i>
                  <h4 class="h5 card-title">Bagikan Kisah Anda</h4>
                  <p class="card-text">Tuliskan pengalaman Anda, lampirkan foto dari momen-momen penting, dan tandai lokasi persisnya di peta.</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card h-100 shadow-sm text-center p-3">
                  <i class="fas fa-map-marked-alt fa-3x text-primary mb-3"></i>
                  <h4 class="h5 card-title">Jelajahi Peta Cerita</h4>
                  <p class="card-text">Lihat cerita-cerita dari seluruh dunia yang ditampilkan di peta interaktif kami. Temukan kisah-kisah tersembunyi.</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card h-100 shadow-sm text-center p-3">
                  <i class="fas fa-users fa-3x text-primary mb-3"></i>
                  <h4 class="h5 card-title">Terhubung</h4>
                  <p class="card-text">Baca, komentari, dan dapatkan inspirasi dari cerita-cerita yang dibagikan oleh komunitas kami.</p>
                </div>
              </div>
            </div>

            <h2 class="h3 mb-3 text-primary">Tim di Balik Jejak Cerita</h2>
            <div class="row justify-content-center mb-4">
              <div class="col-md-6 col-lg-4 mb-3">
                <div class="card h-100 shadow-sm text-center p-3">
                  <img src="https://via.placeholder.com/100" alt="Foto Developer Utama" class="img-fluid rounded-circle mx-auto d-block mb-3 border border-3 border-primary">
                  <h3 class="h5 card-title">Julianda Putra Mansur</h3>
                  <p class="text-muted">Pengembang Utama</p>
                  <p class="card-text">Berkomitmen untuk menciptakan pengalaman berbagi cerita yang mulus dan bermakna.</p>
                </div>
              </div>
              </div>

            <h2 class="h3 mb-3 text-primary">Hubungi Kami</h2>
            <p>Punya pertanyaan, saran, atau hanya ingin menyapa? Jangan ragu untuk menghubungi kami melalui email:</p>
            <p class="text-center lead"><a href="mailto:support@jejakcerita.com" class="text-decoration-none text-primary fw-bold">support@jejakcerita.com</a></p>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}
