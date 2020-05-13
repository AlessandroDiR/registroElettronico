using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ProjectWork.Models;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

namespace ProjectWork
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            SecretClientOptions opt = new SecretClientOptions()
            {
                Retry =
                {
                    Delay= TimeSpan.FromSeconds(2),
                    MaxDelay = TimeSpan.FromSeconds(16),
                    MaxRetries = 5,
                    Mode = Azure.Core.RetryMode.Exponential
                 }
            };
            var client = new SecretClient(new Uri("https://avosecrets.vault.azure.net/"), new DefaultAzureCredential(), opt);

            KeyVaultSecret secret = client.GetSecret("remoteString");

            string remoteString = secret.Value;

            // Use SQL Database if in Azure, otherwise, use local Database
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production")
                services.AddDbContext<AvocadoDBContext>(options =>
                        options.UseSqlServer(remoteString));
            else
                services.AddDbContext<AvocadoDBContext>(options =>
                        options.UseSqlServer(Environment.GetEnvironmentVariable("LOCAL_STRING")));

            // Automatically perform database migration
            services.BuildServiceProvider().GetService<AvocadoDBContext>().Database.Migrate();

           

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllHeaders", builder =>
                {
                    builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseHttpsRedirection();
            app.UseMvc();
            app.UseCors("AllowAllHeaders");
        }
    }
}