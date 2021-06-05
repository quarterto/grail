class User < ApplicationRecord
  has_secure_password
  has_many :user_campaigns
  has_many :campaigns, through: :user_campaigns
  has_many :cards
  validates :email, presence: true, uniqueness: true
  validates :username, presence: true, uniqueness: true

  only_visible :campaigns

  def gravatar(size: 64)
    Gravatar.src(email, size, 'monsterid')
  end

  def to_param
    username
  end
end
