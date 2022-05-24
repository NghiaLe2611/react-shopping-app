import Modal from '../UI/Modal';
import ModalSlides from '../slides/ModalSlides';
import classes from '../../scss/ProductModal.module.scss';

const ProductModal = (props) => {
	const {product, closeModalInfo, showInfoModal, 
        activeModalTab, setActiveModalTab} = props;
    const specs = product.specs;
    
    const mountedBtnStyle = { animation: "fadeIn 250ms ease-out forwards" };
    const unmountedBtnStyle = { animation: "fadeOut 250ms ease-out forwards" };

    const showModalTab = (tab) => {
        setActiveModalTab(tab);
    };

	return (
		<Modal isShowModal={showInfoModal} animation='slide'
			contentClass={classes.infoModal}
			close={
				<span className={classes['close-specs']} onClick={closeModalInfo} style={showInfoModal ? mountedBtnStyle : unmountedBtnStyle}>
					<i>&times;</i> Đóng
				</span>
			}
			closeModal={closeModalInfo}>
			<div className={classes['wrap-info-modal']}>
				<div className={classes['fixed-tab']}>
					<ul>
						{product.featureImgs.length > 0 && (
							<li className={`${activeModalTab === 'highlight' ? classes.selected : ''}`} onClick={(e) => showModalTab('highlight')}>
								Điểm nổi bật
							</li>
						)}
						{product.variations && product.variations.colors.length
							? product.variations.colors.map((item) => (
									<li key={item.color} className={`${activeModalTab === `color-${item.color}` ? classes.selected : ''}`} onClick={(e) => showModalTab(`color-${item.color}`)}>
										{item.color}
									</li>
							  ))
							: null}
						<li className={`${activeModalTab === 'thong-so' ? classes.selected : ''}`} onClick={(e) => showModalTab('thong-so')}>
							Thông số kỹ thuật
						</li>
						<li className={`${activeModalTab === 'danh-gia' ? classes.selected : ''}`} onClick={(e) => showModalTab('danh-gia')}>
							Bài viết đánh giá
						</li>
						<li className={classes['close-specs']}>
							<i>&times;</i>
						</li>
					</ul>
				</div>
				{product.featureImgs && (
					<div className={`${classes['modal-tab']} ${activeModalTab === 'highlight' ? classes.show : ''}`} id='highlight'>
						<ModalSlides featureImgs={product.featureImgs} name={product.name} />
					</div>
				)}
				{product.variations && product.variations.colors.length
					? product.variations.colors.map((item, colorIndex) => (
							<div key={item.color} className={`${classes['modal-tab']} ${activeModalTab === `color-${item.color}` ? classes.show : ''}`} id={`color-${item.color}`}>
								<ModalSlides images={item.images} color={item.color} />
							</div>
					  ))
					: null}
				<div className={`${classes['modal-tab']} ${activeModalTab === 'thong-so' ? classes.show : ''}`} id={classes['thong-so']}>
					<div className={classes.item}>
						<p className={classes.specs}>Màn hình</p>
						<ul className={classes.list}>
							<li>
								<span className={classes.lbl}>Công nghệ màn hình:</span>
								<p className={classes.info}>{specs.display.type}</p>
							</li>
							<li>
								<span className={classes.lbl}>Độ phân giải:</span>
								<p className={classes.info}>{specs.display.resolution}</p>
							</li>
							<li>
								<span className={classes.lbl}>Màn hình rộng:</span>
								<p className={classes.info}>{specs.display.size}"</p>
							</li>
							<li>
								<span className={classes.lbl}>Mặt kính cảm ứng:</span>
								{specs.display.glass ? <p className={classes.info}>{specs.display.glass}</p> : <p className={classes.info}>-</p>}
							</li>
						</ul>
					</div>
					<div className={classes.item}>
						<p className={classes.specs}>Hệ điều hành & CPU</p>
						<ul className={classes.list}>
							<li>
								<span className={classes.lbl}>Hệ điều hành:</span>
								<p className={classes.info}>{specs.platform.os}</p>
							</li>
							<li>
								<span className={classes.lbl}>Chip xử lý (CPU):</span>
								<p className={classes.info}>{specs.platform.chip}</p>
							</li>
							<li>
								<span className={classes.lbl}>Tốc độ CPU:</span>
								<p className={classes.info}>{specs.platform.cpu}</p>
							</li>
							<li>
								<span className={classes.lbl}>Chip đồ họa (GPU):</span>
								<p className={classes.info}>{specs.platform.gpu}</p>
							</li>
						</ul>
					</div>
					<div className={classes.item}>
						<p className={classes.specs}>Bộ nhớ & Lưu trữ</p>
						<ul className={classes.list}>
							<li>
								<span className={classes.lbl}>RAM:</span>
								<p className={classes.info}>{specs.memory.ram} GB</p>
							</li>
							<li>
								<span className={classes.lbl}>Bộ nhớ trong:</span>
								<p className={classes.info}>{specs.memory.rom} GB</p>
							</li>
							<li>
								<span className={classes.lbl}>Thẻ nhớ:</span>
								<p className={classes.info}>{specs.memory.card_slot}</p>
							</li>
						</ul>
					</div>
					<div className={classes.item}>
						<p className={classes.specs}>Camera sau</p>
						<ul className={classes.list}>
							<li>
								<span className={classes.lbl}>Độ phân giải:</span>
								<p className={classes.info}>{specs.camera.back.resolution}</p>
							</li>
							{specs.camera.back.video && (
								<li>
									<span className={classes.lbl}>Quay phim:</span>
									<p className={classes.info}>{specs.camera.back.video}</p>
								</li>
							)}
							{specs.camera.back.features && (
								<li>
									<span className={classes.lbl}>Tính năng:</span>
									<p className={classes.info}>
										{specs.camera.back.features.map((item) => (
											<span key={item}>{item}</span>
										))}
									</p>
								</li>
							)}
						</ul>
					</div>
					{specs.camera.front !== 'Không' && (
						<div className={classes.item}>
							<p className={classes.specs}>Camera trước</p>
							<ul className={classes.list}>
								<li>
									<span className={classes.lbl}>Độ phân giải:</span>
									<p className={classes.info}>{specs.camera.front.resolution}</p>
								</li>
								<li>
									<span className={classes.lbl}>Tính năng:</span>
									{specs.camera.front.features && (
										<p className={classes.info}>
											{specs.camera.front.features.map((item) => (
												<span key={item}>{item}</span>
											))}
										</p>
									)}
								</li>
							</ul>
						</div>
					)}
					<div className={classes.item}>
						<p className={classes.specs}>Kết nối</p>
						<ul className={classes.list}>
							<li>
								<span className={classes.lbl}>Wifi:</span>
								<p className={classes.info}>{specs.connectivity.wifi}</p>
							</li>
							<li>
								<span className={classes.lbl}>Bluetooth:</span>
								<p className={classes.info}>{specs.connectivity.bluetooth}</p>
							</li>
							<li>
								<span className={classes.lbl}>USB:</span>
								<p className={classes.info}>{specs.connectivity.usb}</p>
							</li>
							<li>
								<span className={classes.lbl}>Jack tai nghe:</span>
								<p className={classes.info}>{specs.connectivity.audio ? specs.connectivity.audio : '-'}</p>
							</li>
							<li>
								<span className={classes.lbl}>Radio:</span>
								<p className={classes.info}>{specs.connectivity.radio ? specs.connectivity.radio : '-'}</p>
							</li>
						</ul>
					</div>
					<div className={classes.item}>
						<p className={classes.specs}>Pin & sạc</p>
						<ul className={classes.list}>
							<li>
								<span className={classes.lbl}>Dung lượng pin:</span>
								<p className={classes.info}>{specs.pin} mah</p>
							</li>
						</ul>
					</div>
					<div className={classes.item}>
						<p className={classes.specs}>Thông tin khác</p>
						<ul className={classes.list}>
							<li>
								<span className={classes.lbl}>Kích thước:</span>
								<p className={classes.info}>{specs.body.dimensions}</p>
							</li>
							<li>
								<span className={classes.lbl}>Nặng:</span>
								<p className={classes.info}>{specs.body.weight} g</p>
							</li>
							<li>
								<span className={classes.lbl}>Thời điểm ra mắt:</span>
								<p className={classes.info}>{product.released}</p>
							</li>
						</ul>
					</div>
				</div>
				<div className={`${classes['modal-tab']} ${activeModalTab === 'danh-gia' ? classes.show : ''}`} id='danh-gia'>
					<p className={classes.desc}>
						{product.description
							? product.description
							: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Numquam, saepe! Ea, labore suscipit! Inventore incidunt mollitia error nemo atque placeat cumque reiciendis rerum deleniti, distinctio cum animi quasi quam? Modi aperiam suscipit fugiat voluptatum similique, placeat vitae! Consectetur voluptate recusandae in corrupti, eligendi ipsum laborum quasi magni placeat officia natus.'}
					</p>
				</div>
			</div>
		</Modal>
	);
};

export default ProductModal;