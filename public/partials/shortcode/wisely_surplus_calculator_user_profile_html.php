<?php if ( ! defined( 'ABSPATH' ) ) { die; } // If this file is called directly, abort.


/**
 * wcp_user_profile Shortcode HTML Callback File.
 * 
 * @since      1.0.0
 * @package    Wisely_Surplus_Calculator
 * @subpackage Wisely_Surplus_Calculator/public/partials/shortcode
 * @author     World Web Technology <biz@worldwebtechnology.com>
 * 
 */

global $wpdb, $woocommerce, $product;

if( is_admin() ){
    return null;
}

if ( !is_user_logged_in() ) {            
    
    return _e('Please Get Login to View Profile!', 'wisely-surplus-calculator');
}
    $user = wp_get_current_user();
    $user_id = ( isset( $user->ID ) ? (int) $user->ID : 0 );    

    $firstname = $user->first_name;
    $lastname  = $user->last_name;
    $username     = $user->user_login;
    $user_nicename  = $user->user_nicename;
    $user_email     = $user->user_email;
    $display_name   = $user->display_name;
    $nickname  = $user->nickname;
    $bio       = $user->description;

    $address = get_user_meta($user_id, 'billing_address_1', true );
    $address = (isset($address) ? $address : '');

    $address_2 = get_user_meta($user_id, 'billing_address_2', true );
    $address_2 = (isset($address_2) ? $address_2 : '');

    $city = get_user_meta($user_id, 'billing_city', true );
    $city = (isset($city) ? $city : '');

    $province = get_user_meta($user_id, 'billing_state', true );
    $province = (isset($province) ? $province : '');

    $country = get_user_meta($user_id, 'billing_country', true );
    $country = (isset($country) ? $country : '');

    $postal_code = get_user_meta($user_id, 'billing_postcode', true );
    $postal_code = (isset($postal_code) ? $postal_code : '');


?>

<div class="wrap user-profile-wrap">
    <div class="user-profile-sec user-page">
        <div class="login profile-header-info">
            <h3><?php echo $firstname." ".$lastname; ?></h3>     
        </div>
    </div>
    <div class="login profile-list-form">
        <div class="profile-detail-cont">
        <div class="col col1">
            <div class="top-box box-1">
                <h4><?php _e('Account Details','wisely-surplus-calculator'); ?></h4>
                <div class="user-info-box">
                    <form id="edit_profile_form" autocomplete="off" class="edit_profile" action="" name="edit_profile_form" method="post">
                        <div class="form-control-wrap form-group">
                            <label for="wsc_first_name">
                                <?php esc_html_e('Username','wisely-surplus-calculator'); ?>
                            </label>                            
                            <input readOnly name="wsc_firstname" value="<?php echo (isset($firstname) ? $firstname : ''); ?>" placeholder="" class="form-control is-disabled"   autocomplete="off" id="wsc_first_name" type="text"/>
                        </div>
                        <div class="form-control-wrap form-group">
                            <label for="wsc_last_name">
                                <?php esc_html_e('Name','wisely-surplus-calculator'); ?>
                            </label>
                            <input readOnly class="form-control is-disabled" value="<?php echo (isset($firstname) ? $firstname : ''); ?>" id="wsc_last_name" autocomplete="off" type="text" name="wsc_lastname" placeholder="">
                        </div>
                        <div class="form-control-wrap form-group">
                            <label for="wsc_email">
                                <?php esc_html_e('Email','wisely-surplus-calculator'); ?>
                            </label>
                            <p class="is-readonly wsc_email"><?php echo $user_email; ?></p>
                        </div>
                        <div class="form-control-border"></div>

                        <div class="edit-account-info form-submit-wrap">
                            <a class="update-profile-detail" href="<?php get_the_permalink(); ?>/my-account/edit-account/" class=""><?php esc_html_e('Update profile details','wisely-surplus-calculator'); ?></a>
                        </div>
                    </form>
                </div>
            </div>
            <?php //echo 'User ID: ' . get_current_user_id();
                $user_id = get_current_user_id(); 
                $customer = new WC_Customer( $user_id );               
                $last_order = $customer->get_last_order();

                if( !empty($last_order) ) {
                    $order_id     = $last_order->get_id(); 
                    $order_data   = $last_order->get_data(); 
                    $order_status = $last_order->get_status();
                    
                    $order_m = wc_get_order($order_id);
                    
                    $users_subscriptions = wcs_get_users_subscriptions($user_id);
                    
                    foreach ($users_subscriptions as $key => $subscription){ 
                        $new = $subscription->get_date('next_payment');
                        $new_date = date("F d, Y", strtotime($new));
                        $sub_id = $subscription->get_ID();
                        $date_bill = $subscription->get_billing_period(); 
                    }
                } else {
                    //echo "<pre>"; print_r('No orders/subscriptions found!'); echo "</pre>";
                }
            ?>

            <?php if ( !empty($subscription) ) {
                if ($subscription->has_status(array('active'))) { 
                ?>
                <div class="top-box box-2 current-plan">
                    <h4><?php _e('Current Plan','wisely-surplus-calculator'); ?></h4>
                    <div class="user-info-box user-plan-info plan-box">
                        <h5>
                        <?php 
                            if(!empty ($date_bill) && isset($date_bill)){
                            echo $date_bill; 
                        } ?>
                        </h5>
                        <p class="form-control-wrap form-subscribe-wrap">          <?php esc_html_e('Subscription renewal plan','wisely-surplus-calculator'); ?>
                        </p>
                        <p class="form-control-wrap form-date-wrap">                  
                            <?php 
                                if(!empty ($new_date) && isset($new_date)){
                                    echo $new_date; 
                            } ?>
                        </p>
                        <div class="form-control-border border-s2"></div>
                        <div class="edit-account-info">
                            <a href="<?php get_the_permalink(); ?>/my-account/view-subscription/<?php echo $sub_id; ?>" class="update-profile-detail">
                                <?php esc_html_e('Renew Your Membership','wisely-surplus-calculator'); ?>
                            </a>
                        </div>
                    </div>
                </div>
                <?php }
            } ?>
        </div>
        <div class="col col2">
            <?php if ( !empty($subscription) ) { ?>
            <div class="Side-box box-2">
                <h4><?php _e('Payment Details','wisely-surplus-calculator'); ?></h4>
                <div class="user-payment-box">
                    <div class="row-box">

                    <div class="payment-method-wrap">
                        <div class="payment-billing-wrap">
                            <h5><?php _e('Payment Method','wisely-surplus-calculator'); ?></h5>
                            <p class="form-control-wrap form-subscribe-wrap">          <?php esc_html_e('Credit Card','wisely-surplus-calculator'); ?></p>
                            <p class="form-control-wrap form-date-wrap"><?php esc_html_e('Visa ending in 4242','wisely-surplus-calculator'); ?></p>
                            <p class="form-control-wrap form-subscribe-wrap">          <?php esc_html_e('Expiry Date','wisely-surplus-calculator'); ?></p>
                            <p class="form-control-wrap form-date-wrap"><?php esc_html_e('04/24','wisely-surplus-calculator'); ?></p>        
                        </div>

                        <div class="payment-method-button">
                            <a href="<?php get_the_permalink(); ?>/my-account/payment-methods/" class="update-profile-detail">
                                <?php esc_html_e('Update Payment Method','wisely-surplus-calculator'); ?>
                            </a>
                        </div>
                    </div>            
                    </div>
                    <div class="row-box">
                        <div class="payment-method-wrap billing-info">
                            <div class="payment-billing-wrap">
                                <h5><?php _e('Billing information','wisely-surplus-calculator'); ?></h5>
                                 <?php $order = wc_get_order( $order_id ); 
                                    $customer_id = $order->get_customer_id(); 
                                    $billing_address_1  = $order->get_billing_address_1();
                                    $billing_address_2  = $order->get_billing_address_2();
                                    $billing_city = $order->get_billing_city();
                                    $billing_state = $order->get_billing_state();
                                    $billing_postcode = $order->get_billing_postcode();
                                    $billing_country = $order->get_billing_country();
                                  ?>
                                <p class="site-payment-visa">
                                    <?php echo $billing_address_1;?> <?php echo $billing_address_2;?><br>
                                    <?php echo $billing_city;?><?php echo $billing_state;?><br>
                                    <?php echo $billing_postcode;?><?php echo $billing_country;?>
                                </p>
                            </div>
                            <div class="payment-method-button">
                                <a href="<?php get_the_permalink(); ?>/my-account/edit-address/" target="_blank" class="update-profile-detail">
                                    <i class="fa fa-external-link" aria-hidden="true"></i>
                                    <?php esc_html_e('Update billing information','wisely-surplus-calculator'); ?>
                                </a>
                            </div>
                        </div>    
                    </div>
                </div>
            </div>
            <?php } ?>
            <div class="Side-box box-2 savereport-ss">
                <h4><?php _e('Saved Reports','wisely-surplus-calculator'); ?></h4>
                <div class="user-payment-box user-reports-info">
                    <div class="user-payment-table">
                        <div class="report-head">
                            <div class="report-date">
                                <h5><?php esc_html_e('Date','wisely-surplus-calculator'); ?></h5>
                            </div>
                            <div class="report-name">
                                <h5><?php esc_html_e('File Name','wisely-surplus-calculator'); ?></h5>
                            </div>
                            <div class="report-action">
                                <h5><?php esc_html_e('Action','wisely-surplus-calculator'); ?></h5>
                            </div>
                        </div>
                        <div class="report-body">
                            <?php 

                                global $wp_filesystem;
                                $file_path = WISELY_SURPLUS_CALCULATOR_DIR . '/public/pdf-save-folder/';
                                $filelist = $wp_filesystem->dirlist( $file_path ); 
                                
                                foreach($filelist as $filedata){ 

                                    $file_name_arr = explode('-',$filedata['name']);
                                    $file_user_id = (int) $file_name_arr[0];

                                    if($file_user_id==$user_id){
                                    ?>
                                    <div class="report-body-row">
                                        <div class="report-date-data">
                                            <p><?php echo $filedata['lastmod']; ?></p>
                                        </div>
                                        <div class="report-name-data">
                                            <p><?php echo $filedata['name']; ?></p>
                                        </div>
                                        <div class="report-action-data">
                                            <a href="javascript:void(0)" id="pdf-user"><i class="fa-regular fa-file-arrow-down"></i></a>
                                            <!-- <a href="<?php //echo site_url('/?pdf-report=download');?>"></a> -->
                                        </div>
                                    </div>
                                <?php 

                                }

                            }
                                //echo "<pre>";print_r($filelist);
                            ?>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        
    </div>
</div>
