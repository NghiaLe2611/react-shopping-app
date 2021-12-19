import Modal from './Modal';
import classes from '../../scss/ComparePopup.module.scss';
import iconAdd from '../../assets/images/icon-add.png';

const ComparePopup = (props) => {
	return (
		<div className={classes['compare-modal']}
			style={{ display: props.isComparing ? 'block' : 'none' }}
		>
			<div className={classes['wrap-compare']}>
				<ul className={classes['list-compare']}>
					{props.listCompare.map((item, index) =>
						item._id ? (
							<li key={item._id}>
								<div className={classes.img}>
									<img src={item.img} alt='' />
								</div>
								<p className={classes.txt}>{item.name}</p>
								<span
									onClick={() => props.removeItemCompare(item._id)}
								>
									&times;
								</span>
							</li>
						) : (
							<li key={index}>
								<div
									className={classes.img}
									onClick={() => props.addToCompare()}
								>
									<img src={iconAdd} alt='' />
									<p className={classes.txt}>Thêm sản phẩm</p>
								</div>
							</li>
						)
					)}
				</ul>
				<div className={classes['close-compare']}>
					<span
						className={classes['btn-compare']}
						onClick={props.confirmCompare}
					>
						So sánh
					</span>
					<span className={classes['btn-remove']}>
						Xóa tất cả sản phẩm
					</span>
				</div>
			</div>
			<span
				className={classes.close}
				onClick={() => {
					props.setIsComparing(false);
				}}
			>
				Đóng &times;
			</span>
		</div>
	);
};

export default ComparePopup;
