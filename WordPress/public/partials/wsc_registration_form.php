<script src="https://www.google.com/recaptcha/api.js" async defer></script>
<div class="wsc-registration-form wsc-general-wrap" style="display:none;">
	
	<h2 class="wsc-sign-up">Register Today</h2>
	
	<form class="form-horizontal registraion-form" action="#" role="form" id="wsc_custom_signup" method="post" name="wsc_custom_signup">
		<div class="wsc-general-info">
			
				<div class="form-group wsc-col-50 form-first-name">
					<label for="wsc_first_name" class="sr-only">First Name</label>
					<input type="text" name="wsc_first_name" id="wsc_first_name" value="" maxlength="50" placeholder="First Name" class="form-control" />
				</div>
			
			
				<div class="form-group wsc-col-50 form-last-name">
					<label for="wsc_last_name" class="sr-only">Last Name</label>
					<input type="text" name="wsc_last_name" id="wsc_last_name" value="" maxlength="50" placeholder="Last Name" class="form-control" />
				</div>
			

				<div class="form-group wsc-col-50 form-email">
					<label for="wsc_email" class="sr-only">Email</label>
					<input type="email" name="wsc_email" id="wsc_email" value="" placeholder="Email" class="form-control" />
				</div>

				<div class="form-group wsc-col-50 form-pass">
					<label for="wsc_pass" class="sr-only">Password</label>
					<input type="password" name="wsc_pass" id="wsc_pass" value="" placeholder="Password" class="form-control" />
				</div>
			
				<div class="form-group wsc-col-50 form-confirm-pass">
					<label for="wsc_confirm_pass" class="sr-only">Confirm Password</label>
					<input type="password" name="wsc_confirm_pass" id="wsc_confirm_pass" value="" placeholder="Confirm Password" class="form-control" />
				</div>

				<div class="form-group wsc-col-50 form-select">
					<label for="wsc_plan_sec" class="sr-only">Wisely Packages</label>
					<select name="wsc_plan_sec" id="wsc_plan_sec" class="form-control">
						<option value="">Select Package</option>
						<?php 
							$wisely_packages = wc_get_products( array( 'status' => 'publish', 'limit' => -1 ) );
							foreach ( $wisely_packages as $wisely_package ){ 
							    $packageID = $wisely_package->get_id();
							    $packageTitle = $wisely_package->get_title();
							    $packageSlug = $wisely_package->get_slug();
							    $packagePrice = $wisely_package->get_price();
							    echo "<option value=". $packageID ." >". $packageTitle ."</option>";
							}

						?>
					</select>
				</div>

				<div class="check-success register-check-success"></div>
				<div class="check-error register-check-error"></div>		
				
				<div class="form-group wsc-col-50 text-center">
				    <div class="g-recaptcha" data-sitekey="6LeFPwQkAAAAAMLbVu9lmvcSOEOPU3S96nnojfv0" id="g_recaptcha"></div>
				    <textarea class="wsc_g_recaptcha" name="wsc_g_recaptcha" id="wsc_g_recaptcha" style="display: none;"></textarea>
				    <label id="wsc_g_recaptcha_error" class="check-error" for="wsc_g_recaptcha_error" style="display: none;">Please checked reCaptcha</label>
				</div>
				
				<div class="form-group wsc-col-50 text-center">
					<input type="hidden" name="wsc_new_user_nonce" id="wsc_new_user_nonce" value="yes">
				
					<button type="submit" class="upload-logo wsc-btn-style" name='wsc_new_user_btn' id="wsc-new-user-btn">Submit</button>

					<div class="submit-loader" style="display:none;">
					</div>
					
				</div>
				<div class="form-group wsc-col-100 text-center">					
						<span class="wsc_msg" style="display:none;"></span>
						<a href="javascript:void(0)" class="login-display">Login</a>				
					</div>

		</div>
		
		
		<div class="wsc-general-info wsc-billing-info">
						
		</div>		
	</form>
	
	
</div>
<div class="wsc-login-form wsc-general-wrap">
	<h2 class="wsc-sign-up">Login</h2>
	<form class="form-horizontal login-form" action="#" role="form" id="wsc_custom_login" method="post">
		<div class="wsc-general-info">
			<div class="form-group wsc-col-100">
				<label for="wsc_login_name" class="sr-only">Username or Email</label>
				<input type="text" name="wsc_login_name" id="wsc_login_name" value="" placeholder="Username or Email" class="form-control" />
			</div>
			<div class="form-group wsc-col-100">
				<label for="wsc_login_pass" class="sr-only">Password</label>
				<input type="password" name="wsc_login_pass" id="wsc_login_pass" value="" placeholder="Password" class="form-control" />
			</div>
			<div class="check-success login-check-success"></div>
			<div class="check-error login-check-error"></div>
			<div class="form-group wsc-col-100 text-center">
				<?php wp_nonce_field('wsc_login_user','wsc_login_user_nonce'); ?>
				<button type="submit" class="upload-logo wsc-btn-style" name='wsc_login_user_btn ' id="wsc-login-user-btn ">Submit</button>	<div class="submit-loader" style="display:none;"></div>
			</div>
			<div class="form-group wsc-col-100 text-center wsc-cc-forget">
				<a href="javascript:void(0)" class="signup-display">Create an account</a>
				<a href="javascript:void(0)" class="forgot-psw-display">Forgot password?</a>
			</div>
		</form>
		
	</div>
	
</div>
<div class="wsc-forgot-form wsc-general-wrap" style="display:none;"	>
	<h2 class="wsc-sign-up">Forgot Password</h2>
	<form class="form-horizontal forgot-form" action="#" role="form" id="wsc_custom_forgot" method="post">
		<div class="wsc-general-info">
			<div class="form-group wsc-col-100">
				<label for="wsc_email" class="sr-only">Email</label>
				<input type="email" name="wsc_forgot_email" id="wsc_forgot_email" value="" placeholder="Email" class="form-control" />
			</div>
			<div class="check-success forgot-check-success"></div>
			<div class="check-error forgot-check-error"></div>
			<div class="form-group wsc-col-100 text-center">
				<?php wp_nonce_field('wsc_forgot_user','wsc_forgot_user_nonce'); ?>
				<button type="submit" class="upload-logo wsc-btn-style" name='wsc_forgot_user_btn' id="wsc-login-forgot-btn">Submit</button><div class="submit-loader" style="display:none;"></div>
			</div>
			<div class="form-group wsc-col-100 text-center wsc-cc-forget">
				<a href="javascript:void(0)" class="signup-display">Create an account</a>
				<a href="javascript:void(0)" class="login-display">Login</a>
			</div>
		</div>
		
	</form>
	
</div>
<?php if(isset($_GET['action']) && isset($_GET['login']) && $_GET['action'] =='rp'){ ?>
<div class="wsc-reset-password">
	<h2>Reset Password</h2>
	<form class="form-horizontal reset-form" action="#" role="form" id="wsc_reset_password_frm" method="post">
		<input type="hidden" id="user_login" value="<?php echo $_GET['login']; ?>" >
		<div class="form-group">
			<label for="wsc_new_password" class="sr-only">New Password</label>
			<input type="password" name="wsc_new_password" id="wsc_new_password" value="" placeholder="New Password" class="form-control" />
		</div>
		<div class="form-group">
			<label for="wsc_cnfrmnew_password" class="sr-only">Confirm New Password</label>
			<input type="password" name="wsc_cnfrmnew_password" id="wsc_cnfrmnew_password" value="" placeholder="Confirm New Password" class="form-control" />
		</div>
		<div class="check-success response-check-success"></div>
		<div class="check-error response-check-error"></div>
		<?php wp_nonce_field('wsc_reset_password','wsc_reset_password_nonce'); ?>
		<button type="submit" class="upload-logo" name='wsc_reset_psw_user_btn' id="wsc-login-reset-btn">Submit</button>
	</form>
</div>
<?php } ?>