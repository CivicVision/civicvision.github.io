activate :i18n, mount_at_root: :en

activate :syntax
set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true, :smartypants => true, :tables => true
set :url_root, 'https://civicvision.de'

activate :blog do |blog|
  # This will add a prefix to all links, template references and source paths
  blog.prefix = "blog"
  blog.name = "blog"
  blog.layout = "article"

  blog.permalink = "{lang}/{year}/{month}/{day}/{title}.html"
  # Matcher for blog source files
  blog.sources = "{lang}/{year}-{month}-{day}-{title}.html"
  # blog.taglink = "tags/{tag}.html"
  # blog.summary_separator = /(READMORE)/
  blog.summary_length = 150
  # blog.year_link = "{year}.html"
  # blog.month_link = "{year}/{month}.html"
  # blog.day_link = "{year}/{month}/{day}.html"
  # blog.default_extension = ".markdown"

  # blog.tag_template = "tag.html"
  # blog.calendar_template = "calendar.html"

  # Enable pagination
  # blog.paginate = true
  # blog.per_page = 10
  # blog.page_link = "page/{num}"
end
activate :blog do |blog|
  # This will add a prefix to all links, template references and source paths
  blog.prefix = "sandiego-maps"
  blog.name = "sandiego-maps"
  blog.layout = "sd-article"

  blog.permalink = "{year}/{month}/{day}/{title}.html"
  # Matcher for blog source files
  blog.sources = "{year}-{month}-{day}-{title}.html"
end
activate :blog do |blog|
  blog.prefix = "donor-retention-articles"
  blog.name = "donor-retention-articles"
  blog.layout = "dr-article"
  blog.permalink = "{title}.html"
  blog.sources = "{title}.html"
end
activate :blog do |blog|
  blog.prefix = "data-stories"
  blog.name = "data-stories"
  blog.layout = "ds-article"
  blog.permalink = "{title}.html"
  blog.sources = "{title}.html"
end

page "/feed.xml", layout: false

configure :development do
  activate :livereload
end

helpers do
  def nav_active(path)
    current_page.path == path ? { class: "active "} : {}
  end

  def locale_active(locale)
    I18n.locale == locale.to_sym ? { class: "active" } : {}
  end

  def locale_path(path)
    if I18n.locale == :de
      "/#{I18n.locale.to_s}#{path}"
    else
      path
    end
  end

  def locale_dateformat
    case I18n.locale
    when :de then '%e. %b %Y'
    when :en then '%b %e %Y'
    end
  end

end
activate :directory_indexes

set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'

configure :build do
  ignore '*.swp'
  activate :relative_assets
end

data['donor-retention'].answers.each do |answer|
  proxy "/donor-retention-resources/#{answer.url}/index.html", "/donor-retention-resources.html", locals: { order: answer.order, knows:  answer.knows}, ignore: true
end

data.intro.each do |intro_id|
  intro = data.intros[intro_id.to_sym]
  proxy "/intro/#{intro.url}/index.html", "/intro.html", locals: { portfolio: intro.portfolio_id, fit: intro.fit, text: intro.text}, ignore: true
end

data.content_upgrades.upgrades.each do |upgrade|
  upgrade.items.each do |item|
    proxy "#{upgrade.url}#{item}/thank-you/index.html", "/content-upgrade-thank-you.html", locals: { upgrade: data.content_upgrades[upgrade.name][item], category: upgrade}, ignore: true
  end
end
data.redirects.urls.each do |url|
  proxy "/rdr/#{url.short}/index.html", "/redirect.html", locals: { redirect_url: url.url, keep_params: url.keep_params }, ignore: true
end

activate :deploy do |deploy|
  deploy.build_before = true
  deploy.method = :git
  deploy.branch = "master"
  deploy.commit_message = 'Site updated to ' << `git log --pretty="%h" -n1`
end
