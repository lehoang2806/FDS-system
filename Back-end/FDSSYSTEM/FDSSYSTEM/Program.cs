using FDSSYSTEM.Database;
using FDSSYSTEM.Helper;
using FDSSYSTEM.Helpers;
using FDSSYSTEM.Options;
using FDSSYSTEM.Repositories.CampaignDonorSupportRepository;
using FDSSYSTEM.Repositories.CampaignRepository;
using FDSSYSTEM.Repositories.DonorDonateRepository;
using FDSSYSTEM.Repositories.DonorQuestionRepository;
using FDSSYSTEM.Repositories.FeedBackCommentRepository;
using FDSSYSTEM.Repositories.FeedBackLikeRepository;
using FDSSYSTEM.Repositories.NewCommentRepository;
using FDSSYSTEM.Repositories.NewOfInterestRepository;
using FDSSYSTEM.Repositories.NewRepository;
using FDSSYSTEM.Repositories.NotificationCampaignRepository;
using FDSSYSTEM.Repositories.NotificationRepository;
using FDSSYSTEM.Repositories.OrganizationDonorCertificateRepository;
using FDSSYSTEM.Repositories.OtpRepository;
using FDSSYSTEM.Repositories.PostCommentLikeRepository;
using FDSSYSTEM.Repositories.PostCommentRepository;
using FDSSYSTEM.Repositories.PostLikeRepository;
using FDSSYSTEM.Repositories.PostRepository;
using FDSSYSTEM.Repositories.PostSaveRepository;
using FDSSYSTEM.Repositories.RecipientCertificateRepository;
using FDSSYSTEM.Repositories.RegisterReceiverRepository;
using FDSSYSTEM.Repositories.RequestSupportRepository;
using FDSSYSTEM.Repositories.RoleRepository;
using FDSSYSTEM.Repositories.UserRepository;



using FDSSYSTEM.SeedData;
using FDSSYSTEM.Services.CampaignDonorSupportService;
using FDSSYSTEM.Services.CampaignService;
using FDSSYSTEM.Services.DonorDonateService;
using FDSSYSTEM.Services.DonorQuestionService;
using FDSSYSTEM.Services.FeedBackCommentService;
using FDSSYSTEM.Services.FeedBackLikeService;

using FDSSYSTEM.Services.NewCommentService;
using FDSSYSTEM.Services.NewOfInterest;
using FDSSYSTEM.Services.NewService;
using FDSSYSTEM.Services.NotificationCampaignService;
using FDSSYSTEM.Services.NotificationService;
using FDSSYSTEM.Services.PostCommentLikeService;
using FDSSYSTEM.Services.PostCommentService;
using FDSSYSTEM.Services.PostLikeService;
using FDSSYSTEM.Services.PostSaveService;
using FDSSYSTEM.Services.PostService;
using FDSSYSTEM.Services.RegisterReceiverService;
using FDSSYSTEM.Services.RequestSupportService;
using FDSSYSTEM.Services.RoleService;
using FDSSYSTEM.Services.StatisticService;
using FDSSYSTEM.Services.UserContextService;
using FDSSYSTEM.Services.UserService;
using FDSSYSTEM.SignalR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.CodeAnalysis.Elfie.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSingleton<MongoDbContext>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<IPostRepository, PostRepository>();
builder.Services.AddScoped<IPostService, PostService>();

builder.Services.AddScoped<IPostCommentLikeRepository, PostCommentLikeRepository>();
builder.Services.AddScoped<IPostCommentLikeService, PostCommentLikeService>();

builder.Services.AddScoped<IPostLikeRepository, PostLikeRepository>();
builder.Services.AddScoped<IPostLikeService, PostLikeService>();

builder.Services.AddScoped<IPostSaveRepository, PostSaveRepository>();
builder.Services.AddScoped<IPostSaveService, PostSaveService>();

builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IRoleService, RoleService>();

builder.Services.AddScoped<INewRepository, NewRepository>();
builder.Services.AddScoped<INewService, NewService>();

builder.Services.AddScoped<INewCommentRepository, NewCommentRepository>();
builder.Services.AddScoped<INewCommentService, NewCommentService>();

builder.Services.AddScoped<INewOfInterestRepository, NewOfInterestRepository>();
builder.Services.AddScoped<INewOfInterestService, NewOfInterestService>();

builder.Services.AddScoped<IPostCommentRepository, PostCommentRepository>();
builder.Services.AddScoped<IPostCommentService, PostCommentService>();

builder.Services.AddScoped<ICampaignRepository, CampaignRepository>();
builder.Services.AddScoped<ICampaignService, CampaignService>();

builder.Services.AddScoped<IRegisterReceiverRepository, RegisterReceiverRepository>();
builder.Services.AddScoped<IRegisterReceiverService, RegisterReceiverService>();

builder.Services.AddScoped<INotificationCampaignRepostoy, NotificationCampaignRepository>();
builder.Services.AddScoped<INotificationCampaignService, NotificationCampaignService>();

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddScoped<IUserContextService, UserContextService>();

builder.Services.AddScoped<IOrganizationDonorCertificateRepository, OrganizationDonorCertificateRepository>();
builder.Services.AddScoped<IPersonalDonorCertificateRepository, PersonalDonorCertificateRepository>();
builder.Services.AddScoped<IRecipientCertificateRepository, RecipientCertificateRepository>();

builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<INotificationService, NotificationService>();


builder.Services.AddScoped<ICampaignFeedBackLikeRepository, CampaignFeedBackLikeRepository>();
builder.Services.AddScoped<ICampaignFeedBackLikeService, CampaignFeedBackLikeService>();

builder.Services.AddScoped<ICampaignFeedBackRepository, CampaignFeedBackRepository>();
builder.Services.AddScoped<ICampaignFeedBackService, FeedBackCommentService>();

builder.Services.AddScoped<IRequestSupportRepository, RequestSupportRepository>();
builder.Services.AddScoped<IRequestSupportService, RequestSupportService>();

builder.Services.AddScoped<ICampaignDonorSupportRepository, CampaignDonorSupportRepository>();
builder.Services.AddScoped<ICampaignDonorSupportService, CampaignDonorSupportService>();

builder.Services.AddScoped<IDonorQuestionRepository, DonorQuestionRepository>();
builder.Services.AddScoped<IDonorQuestionService, DonorQuestionService>();

builder.Services.AddScoped<IDonorDonateRepository, DonorDonateRepository>();
builder.Services.AddScoped<IDonorDonateService, DonorDonateService>();

builder.Services.AddScoped<IStatisticService, StatisticService>();


builder.Services.AddScoped<IOtpRepository, OtpRepository>();

builder.Services.Configure<JwtSetting>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.AddSingleton<JwtHelper>();
builder.Services.Configure<SmtpSetting>(builder.Configuration.GetSection("SmtpSetting"));
builder.Services.AddSingleton<EmailHelper>();
builder.Services.Configure<SmsTwilioSetting>(builder.Configuration.GetSection("SMSTwilio"));
builder.Services.AddSingleton<SMSHelper>();
builder.Services.Configure<EmailConfig>(builder.Configuration.GetSection("EmailConfig"));
builder.Services.Configure<PolicyConfig>(builder.Configuration.GetSection("Policy"));


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSetting>();
        var key = Encoding.UTF8.GetBytes(jwtSettings.Key);
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience
        };
    });




//Config cors
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("null", "http://localhost:5173", "http://localhost:4000")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});



builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter Bearer [token]",
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

builder.Services.AddAuthorization();
builder.Services.AddSignalR();


var app = builder.Build();

app.MapHub<NotificationHub>("/notificationhub");

//Default data
using (var scope = app.Services.CreateScope())
{
    var userService = scope.ServiceProvider.GetRequiredService<IUserService>();

    var roleService = scope.ServiceProvider.GetRequiredService<IRoleService>();
    var roleRepository = scope.ServiceProvider.GetRequiredService<IRoleRepository>();
    await SeedData.Initialize(userService, roleService, roleRepository);
}

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
app.UseSwagger();
app.UseSwaggerUI();
//}

// sử dụng CORS
app.UseCors();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
