class UserCampaignsController < ApplicationController
	before_action :set_campaign
	layout "header_and_content"

	def index
		render status: :forbidden unless @campaign.owner?(current_user)
	 end

	def create
		user = User.find_by_username! params[:user_campaign][:user][:username]
		user_campaign = UserCampaign.new(user: user, campaign: @campaign)

		if user_campaign.save
			redirect_to campaign_user_campaigns_path(@campaign)
		else
			render :index
		end
	end

	def set_campaign
		@campaign = Campaign.find_by_slug(params[:campaign_id])
		@image = @campaign.image
	end
end